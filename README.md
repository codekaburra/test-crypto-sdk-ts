# ts-playground-template

## Initialize ts

```
npx create-typescript-application
```

## Initialize prettier

```
npm install --save-dev --save-exact prettier
```

## Initialize husky

```
npm install --save-dev husky lint-staged
npx husky init
node --eval "fs.writeFileSync('.husky/pre-commit','npx lint-staged\n')"
```
