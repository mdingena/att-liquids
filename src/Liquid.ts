import {
  ATTPrefabs,
  LiquidContainerComponent,
  Prefab,
  type LiquidContainerComponentProps,
  type PrefabProps
} from 'att-string-transcoder';

import { EffectDefinition } from './types/EffectDefinition.js';
import { LiquidDefinition } from './types/LiquidDefinition.js';
import { LiquidVisualChunkDefinition } from './types/LiquidVisualChunkDefinition.js';
import { LiquidVisualData } from './types/LiquidVisualData.js';

type LiquidPrefabName =
  | 'Cauldron_Medium'
  | 'Cave_Water_Mound'
  | 'Concoction_Crate'
  | 'Gourd_Canteen'
  | 'Pond_Test'
  | 'Pond_Water'
  | 'Potion_Medium'
  | 'Wooden_Barrel'
  | 'Wooden_Bowl'
  | 'Wooden_Bucket'
  | 'Wooden_Ladle';

type PrefabName<TPrefabName extends LiquidPrefabName> = (typeof ATTPrefabs)[TPrefabName]['name'];

type ColorRGBA = Exclude<LiquidContainerComponentProps['customData'], undefined | null>['color'];

type ColorFormat = 'hexadecimal' | 'rgba';

type Effects = Exclude<LiquidContainerComponentProps['customData'], null | undefined>['effects'];

type CustomLiquidContainerComponent = LiquidContainerComponent & {
  isCustom: true;
  presetHash: 0;
  customData: Exclude<LiquidContainerComponent['customData'], null>;
};

type PresetLiquidContainerComponent = LiquidContainerComponent & {
  isCustom: false;
  presetHash: number;
  customData: null;
};

/**
 * Represents a prefab that can have a LiquidContainer component. This class extends the Prefab
 * class and has additional methods that make it easy to customise liquids.
 */
export class Liquid<TPrefabName extends LiquidPrefabName = LiquidPrefabName> extends Prefab<TPrefabName> {
  private liquidContainerComponent: LiquidContainerComponent;

  /**
   * Creates a prefab with a LiquidContainer component that can be easily manipulated with methods.
   *
   * @example
   * import { Liquid } from 'att-liquids';
   *
   * const liquid = new Liquid('Potion_Medium');
   *
   * liquid
   *   .setColor('#2a455800')
   *   .setVisualAppearance('VisionStewCooked')
   *   .addEffect('Feed', 2)
   *   .addEffect('Heal', 10)
   *   .addEffect('Nourish')
   *   .addEffect('SpeedIndirectEffect', 5)
   *   .addVisualChunk('Salt')
   *   .addVisualChunk('BabuCooked')
   *   .addVisualChunk('TomatoCooked')
   *   .setServings(42);
   */
  constructor(prefabName: TPrefabName, props: PrefabProps<PrefabName<TPrefabName>> = {}) {
    super(prefabName, {
      ...props,
      components: {
        ...props.components,
        LiquidContainer: props.components?.LiquidContainer ?? new LiquidContainerComponent({ version: 1 })
      }
    });

    this.liquidContainerComponent = this.getLiquidContainerComponent();
  }

  /**
   * Adds an effect to the liquid. You may optionally pass an effect strength multiplier.
   *
   * @example
   * import { Liquid } from 'att-liquids';
   *
   * const liquid = new Liquid('Potion_Medium');
   *
   * liquid.addEffect('Nourish', 4.20);
   */
  addEffect(effectName: keyof typeof EffectDefinition, strengthMultiplier = 1): Liquid<TPrefabName> {
    this.makeCustom(this.liquidContainerComponent);

    const hash = EffectDefinition[effectName];

    this.liquidContainerComponent.customData.effects.push({ hash, strengthMultiplier });

    return this;
  }

  /**
   * Adds visual chunks to the liquid, which can be observed when the liquid is poured into an
   * open container like a wooden bowl or ladle.
   *
   * @example
   * import { Liquid } from 'att-liquids';
   *
   * const liquid = new Liquid('Potion_Medium');
   *
   * liquid.addVisualChunk('SpriggullDrumstickCooked');
   */
  addVisualChunk(visualChunkName: keyof typeof LiquidVisualChunkDefinition): Liquid<TPrefabName> {
    this.makeCustom(this.liquidContainerComponent);

    const hash = LiquidVisualChunkDefinition[visualChunkName];

    this.liquidContainerComponent.customData.foodChunks.push(hash);

    return this;
  }

  /**
   * Gets the color of the liquid. You may optionally specify an output format for the color, which
   * is an RGBA object by default.
   *
   * @example
   * import { Liquid } from 'att-liquids';
   *
   * const liquid = new Liquid('Potion_Medium');
   *
   * const rgba = liquid.getColor('rgba');
   * const hexadecimal = liquid.getColor('hexadecimal');
   */
  getColor(format?: 'hexadecimal'): string | undefined;
  getColor(format?: 'rgba'): ColorRGBA | undefined;
  getColor(format: ColorFormat = 'rgba'): string | ColorRGBA | undefined {
    const colorRgba = this.liquidContainerComponent.customData?.color;

    if (typeof colorRgba === 'undefined') return undefined;

    switch (format) {
      case 'hexadecimal':
        return this.rgbaToHexadecimal(colorRgba);

      case 'rgba':
        return colorRgba;

      default:
        throw new Error(`Unsupported color format "${format}".`);
    }
  }

  /**
   * Returns whether or not this liquid can be consumed through skin contact.
   *
   * @example
   * import { Liquid } from 'att-liquids';
   *
   * const liquid = new Liquid('Potion_Medium');
   *
   * const isConsumableThroughSkin = liquid.getConsumableThroughSkin();
   */
  getConsumableThroughSkin(): boolean {
    return this.liquidContainerComponent.customData?.isConsumableThroughSkin ?? false;
  }

  /**
   * Returns an array of all custom effects of the liquid. Does not return effects of preset
   * liquids.
   *
   * @example
   * import { Liquid } from 'att-liquids';
   *
   * const liquid = new Liquid('Potion_Medium');
   *
   * const effects = liquid.getEffects();
   */
  getEffects(): Effects | undefined {
    return this.liquidContainerComponent.customData?.effects;
  }

  /**
   * Gets the LiquidContainer component of the liquid. If none is present on the liquid for whatever
   * reason, one will be created first.
   *
   * @example
   * import { Liquid } from 'att-liquids';
   *
   * const liquid = new Liquid('Potion_Medium');
   *
   * const liquidContainerComponent = liquid.getLiquidContainerComponent();
   */
  getLiquidContainerComponent(): LiquidContainerComponent {
    if (typeof this.components.LiquidContainer === 'undefined') {
      const liquidContainerComponent = new LiquidContainerComponent({ version: 1 });

      this.addComponent(liquidContainerComponent);

      return liquidContainerComponent;
    } else {
      return this.components.LiquidContainer;
    }
  }

  /**
   * Converts a hexadecimal color code to an RGBA object.
   */
  protected hexadecimalToRgba(colorHexadecimal: string): ColorRGBA {
    const r = Math.max(0, Math.min(255, parseInt(colorHexadecimal.slice(1, 3), 16)));
    const g = Math.max(0, Math.min(255, parseInt(colorHexadecimal.slice(3, 5), 16)));
    const b = Math.max(0, Math.min(255, parseInt(colorHexadecimal.slice(5, 7), 16)));
    const a = Math.max(0, Math.min(255, parseInt(colorHexadecimal.slice(7, 9), 16)));

    return { r, g, b, a };
  }

  /**
   * Ensures the given LiquidContainerComponent has custom data.
   */
  protected makeCustom(
    liquidContainerComponent: LiquidContainerComponent
  ): asserts liquidContainerComponent is CustomLiquidContainerComponent {
    liquidContainerComponent.presetHash = 0;
    liquidContainerComponent.isCustom = true;
    liquidContainerComponent.customData = liquidContainerComponent.customData ?? {
      color: {
        r: 255,
        g: 255,
        b: 255,
        a: 255
      },
      isConsumableThroughSkin: false,
      visualDataHash: LiquidVisualData.Teleport,
      effects: [],
      foodChunks: []
    };
  }

  /**
   * Ensures the given LiquidContainerComponent is a preset.
   */
  protected makePreset(
    liquidContainerComponent: LiquidContainerComponent
  ): asserts liquidContainerComponent is PresetLiquidContainerComponent {
    liquidContainerComponent.isCustom = false;
    liquidContainerComponent.customData = null;
  }

  /**
   * Removes all effects from the liquid.
   *
   * @example
   * import { Liquid } from 'att-liquids';
   *
   * const liquid = new Liquid('Potion_Medium');
   *
   * liquid.removeAllEffects();
   */
  removeAllEffects(): Liquid<TPrefabName> {
    if (!this.liquidContainerComponent.isCustom) return this;

    this.makeCustom(this.liquidContainerComponent);

    this.liquidContainerComponent.customData.effects = [];

    return this;
  }

  /**
   * Removes all visual chunks from the liquid.
   *
   * @example
   * import { Liquid } from 'att-liquids';
   *
   * const liquid = new Liquid('Potion_Medium');
   *
   * liquid.removeAllVisualChunks();
   */
  removeAllVisualChunks(): Liquid<TPrefabName> {
    if (!this.liquidContainerComponent.isCustom) return this;

    this.makeCustom(this.liquidContainerComponent);

    this.liquidContainerComponent.customData.foodChunks = [];

    return this;
  }

  /**
   * Removes all effects matching the given name from the liquid.
   *
   * @example
   * import { Liquid } from 'att-liquids';
   *
   * const liquid = new Liquid('Potion_Medium');
   *
   * liquid.removeEffect('Nourish');
   */
  removeEffect(effectName: keyof typeof EffectDefinition): Liquid<TPrefabName> {
    if (!this.liquidContainerComponent.isCustom) return this;

    const hash = EffectDefinition[effectName];

    this.makeCustom(this.liquidContainerComponent);

    this.liquidContainerComponent.customData.effects = this.liquidContainerComponent.customData.effects.filter(
      effect => effect?.hash !== hash
    );

    return this;
  }

  /**
   * Removes all visual chunks matching the given name from the liquid.
   *
   * @example
   * import { Liquid } from 'att-liquids';
   *
   * const liquid = new Liquid('Potion_Medium');
   *
   * liquid.removeVisualChunk('SpriggullDrumstickCooked');
   */
  removeVisualChunk(visualChunkName: keyof typeof LiquidVisualChunkDefinition): Liquid<TPrefabName> {
    if (!this.liquidContainerComponent.isCustom) return this;

    const hash = LiquidVisualChunkDefinition[visualChunkName];

    this.makeCustom(this.liquidContainerComponent);

    this.liquidContainerComponent.customData.foodChunks = this.liquidContainerComponent.customData.foodChunks.filter(
      visualChunkHash => visualChunkHash !== hash
    );

    return this;
  }

  /**
   * Sets the color of the liquid. You may pass either a hexadecimal color code or an RGBA object.
   *
   * @example
   * import { Liquid } from 'att-liquids';
   *
   * const liquid = new Liquid('Potion_Medium');
   *
   * liquid.setColor('#2a455800');
   * // or
   * liquid.setColor({ r: 42, g: 69, b: 88, a: 0 });
   */
  setColor(colorHexadecimal: string): Liquid<TPrefabName>;
  setColor(colorRgba: ColorRGBA): Liquid<TPrefabName>;
  setColor(color: string | ColorRGBA): Liquid<TPrefabName> {
    if (typeof color === 'undefined') {
      throw new Error('You must pass a color to set on this liquid.');
    }

    if (typeof color === 'string' && !/^#[0-9a-f]{8}/.test(color.toLowerCase())) {
      throw new Error(
        `"${color}" is not a valid hexadecimal color code. Make sure the color you pass is 9 characters long and begins with a "#". All characters must be a number between "0" and "9" or a letter between "a" and "f".`
      );
    }

    const colorRgba = typeof color === 'string' ? this.hexadecimalToRgba(color.toLowerCase()) : color;

    this.makeCustom(this.liquidContainerComponent);

    this.liquidContainerComponent.customData.color = colorRgba;

    return this;
  }

  /**
   * Sets the liquid to a preset liquid.
   *
   * @example
   * import { Liquid } from 'att-liquids';
   *
   * const liquid = new Liquid('Potion_Medium');
   *
   * liquid.setPreset('TeleportPotion');
   */
  setPreset(presetName: keyof typeof LiquidDefinition): Liquid<TPrefabName> {
    if (typeof presetName === 'undefined') {
      throw new Error('You must pass a preset name to set on this liquid.');
    }

    this.makePreset(this.liquidContainerComponent);

    const hash = LiquidDefinition[presetName];

    this.liquidContainerComponent.presetHash = hash;

    return this;
  }

  /* c8 ignore start */
  override setServings(servings: number): Liquid<TPrefabName> {
    super.setServings(servings);

    return this;
  }
  /* c8 ignore stop */

  /**
   * Sets the visual appearance of the liquid.
   *
   * @example
   * import { Liquid } from 'att-liquids';
   *
   * const liquid = new Liquid('Potion_Medium');
   *
   * liquid.setVisualAppearance('Teleport');
   */
  setVisualAppearance(visualAppearanceName: keyof typeof LiquidVisualData): Liquid<TPrefabName> {
    if (typeof visualAppearanceName === 'undefined') {
      throw new Error('You must pass a visual appearance name to set on this liquid.');
    }

    this.makeCustom(this.liquidContainerComponent);

    const hash = LiquidVisualData[visualAppearanceName];

    this.liquidContainerComponent.customData.visualDataHash = hash;

    return this;
  }

  /**
   * Converts an RGBA object to a hexadecimal color code.
   */
  protected rgbaToHexadecimal(colorRgba: ColorRGBA): string {
    const r = Math.max(0, Math.min(255, Number(colorRgba.r)))
      .toString(16)
      .padStart(2, '0');
    const g = Math.max(0, Math.min(255, Number(colorRgba.g)))
      .toString(16)
      .padStart(2, '0');
    const b = Math.max(0, Math.min(255, Number(colorRgba.b)))
      .toString(16)
      .padStart(2, '0');
    const a = Math.max(0, Math.min(255, Number(colorRgba.a)))
      .toString(16)
      .padStart(2, '0');

    return `#${r}${g}${b}${a}`;
  }
}
