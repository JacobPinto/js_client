import fs from "fs";
import path from "path";

const projectRoot = process.cwd();
const distRoot = path.join(projectRoot, "dist");

function copyFile(source: string, destination: string): void {
    if (!fs.existsSync(source)) {
        console.warn(`File not found: ${source}`);
        return;
    }

    fs.mkdirSync(path.dirname(destination), {
        recursive: true
    });

    fs.copyFileSync(source, destination);

    console.log(`Copied: ${path.relative(projectRoot, source)}`);
}

function copyDirectory(
    sourceDir: string,
    destinationDir: string,
    allowedExtensions: string[]
): void {
    if (!fs.existsSync(sourceDir)) {
        console.warn(`Directory not found: ${sourceDir}`);
        return;
    }

    const entries = fs.readdirSync(sourceDir, {
        withFileTypes: true
    });

    for (const entry of entries) {
        const sourcePath = path.join(sourceDir, entry.name);
        const destinationPath = path.join(destinationDir, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(
                sourcePath,
                destinationPath,
                allowedExtensions
            );

            continue;
        }

        const extension = path.extname(entry.name).toLowerCase();

        if (allowedExtensions.includes(extension)) {
            copyFile(sourcePath, destinationPath);
        }
    }
}


// ------------------------------------
// Copy index.html
// ------------------------------------

copyFile(
    path.join(projectRoot, "index.html"),
    path.join(distRoot, "index.html")
);


// ------------------------------------
// Copy static files from v/
// ------------------------------------

const staticExtensions = [
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".ico"
];

copyDirectory(
    path.join(projectRoot, "v"),
    path.join(distRoot, "v"),
    staticExtensions
);

console.log("Static files copied successfully.");