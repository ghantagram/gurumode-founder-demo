import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
const manifest=JSON.parse(readFileSync('manifest.json','utf8'));
const actual=readdirSync('site',{recursive:true,withFileTypes:true}).filter(x=>x.isFile()).map(x=>path.relative('site',path.join(x.parentPath,x.name)).split(path.sep).join('/')).sort();
if(JSON.stringify(actual)!==JSON.stringify(Object.keys(manifest.files).sort()))throw Error('Unexpected release files');
for(const [file,expected] of Object.entries(manifest.files)){const hash=createHash('sha256').update(readFileSync(path.join('site',file))).digest('hex');if(hash!==expected)throw Error('Release content changed: '+file);}
console.log('Verified '+actual.length+' release files for '+manifest.topics+' prepared topics.');
