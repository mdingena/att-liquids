# Class: `Liquid`

- [Constructors](#constructors)
  - [`new Liquid(prefabName, props?)`](#new-liquidprefabname-props)
- [Methods](#methods)
  - [`addEffect(effectName, strengthMultiplier?)`](#addeffecteffectname-strengthmultiplier)
  - [`addVisualChunk(visualChunkName)`](#addvisualchunkvisualchunkname)
  - [`getColor(format?)`](#getcolorformat)
  - [`getConsumableThroughSkin()`](#getconsumablethroughskin)
  - [`getEffects()`](#geteffects)
  - [`getLiquidContainerComponent()`](#getliquidcontainercomponent)
  - [`getVisualChunks()`](#getvisualchunks)
  - [`removeAllEffects()`](#removealleffects)
  - [`removeAllVisualChunks()`](#removeallvisualchunks)
  - [`removeEffect(effectName)`](#removeeffecteffectname)
  - [`removeVisualChunk(visualChunkName)`](#removevisualchunkvisualchunkname)
  - [`setColor(color)`](#setcolorcolor)
  - [`setConsumableThroughSkin(isConsumableThroughSkin?)`](#setconsumablethroughskinisconsumablethroughskin)
  - [`setPreset(presetName)`](#setpresetpresetname)
  - [`setVisualAppearance(visualAppearanceName)`](#setvisualappearancevisualappearance)

## Constructors

### `new Liquid(props?)`

Creates a prefab with a `LiquidContainer` component that can be easily manipulated with methods.

- `prefabName` [`<ATTPrefabName>`](./ATTPrefabName.md) The name of the prefab to create.
- `props` (optional) `<PrefabProps>` (see [`att-string-transcoder` API documentation](https://github.com/mdingena/att-string-transcoder/blob/main/docs/Prefab.md#prefabprops))
- Returns: `<Liquid>`

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
```

## Methods

### `addEffect(effectName, strengthMultiplier?)`

Adds an effect to the liquid. You may optionally pass an effect strength multiplier.

- `effectName` [`<keyof typeof EffectDefinition>`](../src/types/EffectDefinition.ts) The name of the effect.
- `strengthMultiplier` (optional, default `1`) `<number>` The strength of the effect.
- Returns: `<this>`

```ts
import { Liquid } from 'att-liquids';

const liquid = new Liquid('Potion_Medium');

liquid.addEffect('Nourish', 4.2);
```

---

### `addVisualChunk(visualChunkName)`

Adds visual chunks to the liquid, which can be observed when the liquid is poured into an open container like a wooden bowl or ladle.

- `visualChunkName` [`<keyof typeof LiquidVisualChunkDefinition>`](../src/types/LiquidVisualChunkDefinition.ts) The name of the visual chunks.
- Returns: `<this>`

```ts
import { Liquid } from 'att-liquids';

const liquid = new Liquid('Potion_Medium');

liquid.addVisualChunk('SpriggullDrumstickCooked');
```

---

### `getColor(format?)`

Gets the color of the liquid. You may optionally specify an output format for the color, which is an RGBA object by default.

- `format` (optional, default `'rgba'`) `<'hexadecimal' | 'rgba'>` The output format.
- Returns: `<string | ColorRGBA>`

```ts
import { Liquid } from 'att-liquids';

const liquid = new Liquid('Potion_Medium');

const rgba = liquid.getColor('rgba');
const hexadecimal = liquid.getColor('hexadecimal');
```

---

### `getConsumableThroughSkin()`

Returns whether or not this liquid can be consumed through skin contact.

- Returns: `<boolean>`

```ts
import { Liquid } from 'att-liquids';

const liquid = new Liquid('Potion_Medium');

const isConsumableThroughSkin = liquid.getConsumableThroughSkin();
```

---

### `getEffects()`

Returns an array of all custom effects of the liquid. Does not return effects of preset liquids.

- Returns: `<Array<{ hash: number; strengthMultiplier; }> | undefined>`

```ts
import { Liquid } from 'att-liquids';

const liquid = new Liquid('Potion_Medium');

const effects = liquid.getEffects();
```

---

### `getLiquidContainerComponent()`

Gets the LiquidContainer component of the liquid. If none is present on the liquid for whatever reason, one will be created first.

- Returns: `<LiquidContainerComponent>` (see [`att-string-transcoder` API documentation](https://github.com/mdingena/att-string-transcoder/blob/main/docs/LiquidContainerComponent.md))

```ts
import { Liquid } from 'att-liquids';

const liquid = new Liquid('Potion_Medium');

const liquidContainerComponent = liquid.getLiquidContainerComponent();
```

---

### `getVisualChunks()`

Returns an array of all custom visual chunks of the liquid. Does not return visual chunks of preset liquids.

- Returns: `<Array<number> | undefined>`

```ts
import { Liquid } from 'att-liquids';

const liquid = new Liquid('Potion_Medium');

const visualChunkHashes = liquid.getVisualChunks();
```

---

### `removeAllEffects()`

Removes all custom effects from the liquid.

- Returns: `<this>`

```ts
import { Liquid } from 'att-liquids';

const liquid = new Liquid('Potion_Medium');

liquid.removeAllEffects();
```

---

### `removeAllVisualChunks()`

Removes all custom visual chunks from the liquid.

- Returns: `<this>`

```ts
import { Liquid } from 'att-liquids';

const liquid = new Liquid('Potion_Medium');

liquid.removeAllVisualChunks();
```

---

### `removeEffect(effectName)`

Removes all custom effects matching the given name from the liquid.

- Returns: `<this>`

```ts
import { Liquid } from 'att-liquids';

const liquid = new Liquid('Potion_Medium');

liquid.removeEffect('Nourish');
```

---

### `removeVisualChunk(visualChunkName)`

Removes all custom visual chunks matching the given name from the liquid.

- Returns: `<this>`

```ts
import { Liquid } from 'att-liquids';

const liquid = new Liquid('Potion_Medium');

liquid.removeVisualChunk('SpriggullDrumstickCooked');
```

---

### `setColor(color)`

Sets the color of the liquid. You may pass either a hexadecimal color code or an RGBA object.

- `color` `<string | ColorRGBA>` The color to set.
- Returns: `<this>`

```ts
import { Liquid } from 'att-liquids';

const liquid = new Liquid('Potion_Medium');

liquid.setColor('#2a455800');
// or
liquid.setColor({ r: 42, g: 69, b: 88, a: 0 });
```

---

### `setConsumableThroughSkin(isConsumableThroughSkin?)`

Sets whether or not the liquid can be consumed through skin contact. Sets true by default.

- `isConsumableThroughSkin` (optional, default `true`) `<boolean>` Whether to set the liquid to be consumable through skin contact.
- Returns: `<this>`

```ts
import { Liquid } from 'att-liquids';

const liquid = new Liquid('Potion_Medium');

liquid.setConsumableThroughSkin();
// or
liquid.setConsumableThroughSkin(true);
```

---

### `setPreset(presetName)`

Sets the liquid to a preset liquid.

- `presetName` [`<keyof typeof LiquidDefinition>`](../src/types/LiquidDefinition.ts) The preset to set.
- Returns: `<this>`

```ts
import { Liquid } from 'att-liquids';

const liquid = new Liquid('Potion_Medium');

liquid.setPreset('TeleportPotion');
```

---

### `setVisualAppearance(visualAppearanceName)`

Sets the visual appearance of the liquid.

- `visualAppearanceName` [`<keyof typeof LiquidVisualData>`](../src/types/LiquidVisualData.ts) The visual appearance to set.
- Returns: `<this>`

```ts
import { Liquid } from 'att-liquids';

const liquid = new Liquid('Potion_Medium');

liquid.setVisualAppearance('Teleport');
```
