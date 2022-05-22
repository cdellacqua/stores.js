import {promises as fsPromises} from 'fs';
import path, {dirname} from 'path';
import readline from 'readline';
import {fileURLToPath} from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));

const projectName = path.basename(currentDir);
const packagePath = path.join(currentDir, 'package.json');
const packageLockPath = path.join(currentDir, 'package-lock.json');

(async () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	function question(text) {
		return new Promise((resolve) => {
			rl.question(text, (answer) => {
				resolve(answer);
			});
		});
	}

	const defaultPackageName = projectName;
	const packageName = (await question(`What's the package name of this project? [${defaultPackageName}] `)) || defaultPackageName;
	const defaultPackageNameCamelCase = projectName.replace(/(_|-[a-z])/g, (lower) => lower.slice(1).toUpperCase());
	const packageNameCamelCase = (await question(`What's the camel case name of this library? [${defaultPackageNameCamelCase}] `)) || defaultPackageNameCamelCase;
	const defaultLicense = 'MIT';
	const license = (await question(`What's the library license? [${defaultLicense}] `)) || defaultLicense;
	const description = await question("What's the library description? ");
	const author = await question("Who's the author? ");
	const keywords = (await question('What are some keywords you would use to describe this library (space separated)? [] ')).split(' ').filter((s) => s.length > 0);
	const git = await question("What's the git repository of this library? ");
	const defaultHomepage = git.replace(/\.git$/, '');
	const homepage = (await question(`What's the homepage of this library? [${defaultHomepage}] `)) || defaultHomepage;
	const defaultIssues = defaultHomepage.length > 0 ? `${defaultHomepage}/issues` : '';
	const issues = (await question(`Where can bugs be reported? [${defaultIssues}] `)) || defaultIssues;

	const packageContent = JSON.parse((await fsPromises.readFile(packagePath)).toString());
	const packageLockContent = JSON.parse((await fsPromises.readFile(packageLockPath)).toString());
	packageContent.name = packageName;
	packageContent.camelCaseName = packageNameCamelCase;
	packageContent.license = license;
	packageContent.description = description;
	packageContent.keywords = keywords;
	packageContent.author = author;
	if (git.length === 0) {
		packageContent.repository = {};
	} else {
		packageContent.repository = {...(packageContent.repository || {}), url: 'git+' + git};
	}
	if (issues.length === 0) {
		packageContent.bugs = {};
	} else {
		packageContent.bugs = {...(packageContent.bugs || {}), url: issues};
	}
	packageContent.homepage = homepage;

	packageLockContent.name = projectName;
	// Starting with lockfileVersion 2 there can be an empty entry
	if (packageLockContent.packages[''] && packageLockContent.packages[''].name) {
		packageLockContent.packages[''].name = projectName;
	}

	await fsPromises.writeFile(packagePath, JSON.stringify(packageContent, undefined, '\t') + '\n');
	await fsPromises.writeFile(packageLockPath, JSON.stringify(packageLockContent, undefined, '\t') + '\n');

	console.log("Done. Don't forget to check your package.json!");

	rl.close();
})();
