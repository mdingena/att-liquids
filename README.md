<h1 align="center">ATT Liquids</h1>

<p align="center">
  <img alt="build status" src="https://img.shields.io/github/actions/workflow/status/mdingena/att-liquids/lint-compile-test.yml?style=for-the-badge" />
  <img alt="npm version" src="https://img.shields.io/npm/v/att-liquids?style=for-the-badge" />
  <img alt="peer dependency" src="https://img.shields.io/npm/dependency-version/att-liquids/peer/att-string-transcoder?style=for-the-badge" />
  <img alt="node version" src="https://img.shields.io/node/v/att-liquids?style=for-the-badge" />
  <img alt="typescript version" src="https://img.shields.io/npm/dependency-version/att-liquids/dev/typescript?style=for-the-badge" />
  <img alt="license" src="https://img.shields.io/npm/l/att-liquids?style=for-the-badge" />
  <a href="CODE-OF-CONDUCT.md"><img alt="contributor covenant v2.0 adopted" src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?style=for-the-badge" /></a>
</p>

---

Makes it easier to create custom liquids in _A Township Tale_ using save strings.

⚠️ This library has a **peer dependency** on [`att-string-transcoder`](https://github.com/mdingena/att-string-transcoder). You must manually install this peer dependency in your project in order to use `att-liquids`.

## :sparkles: Quickstart

### Installation

Add this library to your project's dependencies:

```shell
npm install --save att-liquids
```

### Usage

```ts
import { Liquid } from 'att-liquids';

const liquid = new Liquid('Potion_Medium');

liquid
  .setColor('#2a455800')
  .setVisualAppearance('VisionStewCooked')
  .addEffect('Feed', 2)
  .addEffect('Heal', 10)
  .addEffect('Nourish')
  .addEffect('SpeedIndirectEffect', 5)
  .addVisualChunk('Salt')
  .addVisualChunk('BabuCooked')
  .addVisualChunk('TomatoCooked')
  .setServings(42);

liquid.print();
```

Read the [API Reference Documentation](docs/README.md) for more options.

## :bow: Attribution

This project would not be possible without the knowledge revealed and shared by [poi](https://github.com/officialpoiuytrewq4645). :blue_heart:
