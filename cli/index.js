require("@babel/register")({
	presets: [
		[
			"@babel/preset-env",
			{
				targets: { node: 12 },
			},
		],
		"@babel/preset-typescript",
	],
	plugins: ["@babel/plugin-transform-runtime"],
	extensions: [".js", ".ts"],
});
require("./_utils/configEnv");

require("./_index");
