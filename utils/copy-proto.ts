import fs from "fs";
import path from "path";

const projectRoot = process.cwd();

const sourceRoot = path.join(projectRoot, "server");
const distRoot = path.join(projectRoot, "dist", "server");

function copyProtoDirectories(currentDir: string): void {
    const entries = fs.readdirSync(currentDir, {
        withFileTypes: true
    });

    for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (!entry.isDirectory()) {
            continue;
        }

        if (entry.name === "proto") {
            const relativePath = path.relative(sourceRoot, fullPath);
            const destination = path.join(distRoot, relativePath);

            fs.mkdirSync(destination, {
                recursive: true
            });

            const protoFiles = fs
                .readdirSync(fullPath)
                .filter(file => file.endsWith(".proto"));

            for (const file of protoFiles) {
                fs.copyFileSync(
                    path.join(fullPath, file),
                    path.join(destination, file)
                );

                console.log(`Copied: ${relativePath}/${file}`);
            }

            continue;
        }

        copyProtoDirectories(fullPath);
    }
}

if (fs.existsSync(sourceRoot)) {
    copyProtoDirectories(sourceRoot);
    console.log("Proto files copied successfully.");
} else {
    console.error(`Server directory not found: ${sourceRoot}`);
}