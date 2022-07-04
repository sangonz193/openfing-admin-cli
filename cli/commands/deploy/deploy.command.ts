import path from "path";
import SSH2Promise from "ssh2-promise";
import SFTP from "ssh2-promise/dist/sftp";
import { Stats } from "ssh2-streams";
import { CommandModule } from "yargs";

import { _fs, fs } from "../../_utils/fs";
import { projectPath } from "../../_utils/projectPath";

const command: CommandModule<{}, {}> = {
	command: "deploy" as const,

	describe: "Deploys the app",

	builder: (yargs) => yargs,

	handler: async () => {
		const { SSH_KEY, DESTINATION_PATH, SSH_HOST, SSH_USERNAME } = process.env;

		if (!SSH_KEY) throw new Error("No valid ssh key found");
		if (!DESTINATION_PATH) throw new Error("No valid destination path defined");
		if (!SSH_HOST) throw new Error("No valid ssh host defined");
		if (!SSH_USERNAME) throw new Error("No valid ssh username path defined");

		const uploadRecursive = async (options: { fromPath: string; toPath: string; sftp: SFTP }) => {
			const { fromPath, sftp } = options;
			let { toPath } = options;
			const isDirectory = _fs.lstatSync(fromPath).isDirectory();

			if (!isDirectory)
				await new Promise(async (resolve, reject) => {
					const readStream = _fs.createReadStream(fromPath);
					const writeStream = await sftp.createWriteStream(toPath);

					writeStream.on("close", resolve);
					writeStream.on("error", reject);

					readStream.pipe(writeStream);
				});
			else {
				let stats: Stats | undefined;
				try {
					stats = await sftp.lstat(toPath);
				} catch (e) {}

				let shouldCreateFolder = true;

				if (stats) {
					if (stats.isSymbolicLink()) {
						toPath = await sftp.readlink(toPath);
						stats = await sftp.lstat(toPath);
					}

					if (stats?.isDirectory()) shouldCreateFolder = false;
				}

				if (shouldCreateFolder) await sftp.mkdir(toPath);

				const folderContent = await fs.readdir(fromPath);

				for (const item of folderContent)
					await uploadRecursive({
						fromPath: path.join(fromPath, item),
						toPath: path.join(toPath, item),
						sftp,
					});
			}

			console.log(`- uploaded: ${fromPath} to ${toPath}`);
		};

		const ssh = new SSH2Promise({
			host: SSH_HOST,
			username: SSH_USERNAME,
			privateKey: Buffer.from(SSH_KEY, "base64"),
		});

		await ssh.connect();
		const sftp = ssh.sftp();

		const nodesToUpload = ["dist", "package.json", "package-lock.json"].map((node) => path.join(projectPath, node));

		await Promise.all(
			nodesToUpload.map(async (node) => {
				await uploadRecursive({
					fromPath: node,
					toPath: path.posix.resolve(DESTINATION_PATH, path.relative(projectPath, node)),
					sftp,
				});
			})
		);

		console.log("- done");
		ssh.close();
	},
};

export default command;
