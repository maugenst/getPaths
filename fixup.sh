cat >dist/lib/cjs/package.json <<!EOF
{
    "type": "commonjs"
}
!EOF
mv dist/lib/cjs/FindObjectPaths.d.ts @typings

cat >dist/lib/mjs/package.json <<!EOF
{
    "type": "module"
}
!EOF
mv dist/lib/mjs/FindObjectPaths.d.ts @typings
prettier -w @typings/FindObjectPaths.d.ts
