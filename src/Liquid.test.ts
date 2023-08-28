import { LiquidContainerComponent } from 'att-string-transcoder';

import { Liquid } from './Liquid.js';
import { EffectDefinition } from './types/EffectDefinition.js';
import { LiquidDefinition } from './types/LiquidDefinition.js';
import { LiquidVisualChunkDefinition } from './types/LiquidVisualChunkDefinition.js';
import { LiquidVisualData } from './types/LiquidVisualData.js';

describe('new Liquid()', () => {
  it('returns an instance of the Liquid class', () => {
    const liquid = new Liquid('Potion_Medium');

    expect(liquid.name).toStrictEqual('Potion_Medium');
    expect(liquid.components.LiquidContainer).toBeInstanceOf(LiquidContainerComponent);
    expect(liquid.components.LiquidContainer?.presetHash).toStrictEqual(0);
    expect(liquid.components.LiquidContainer?.isCustom).toStrictEqual(false);
    expect(liquid.components.LiquidContainer?.customData).toStrictEqual(null);
  });
});

describe('Liquid.addEffect()', () => {
  it('adds an effect to the custom data', () => {
    const liquid = new Liquid('Potion_Medium');

    liquid.addEffect('Heal', 1337);

    expect(liquid.components.LiquidContainer?.presetHash).toStrictEqual(0);
    expect(liquid.components.LiquidContainer?.isCustom).toStrictEqual(true);
    expect(liquid.components.LiquidContainer?.customData?.effects).toStrictEqual([
      {
        hash: EffectDefinition.Heal,
        strengthMultiplier: 1337
      }
    ]);
  });
});

describe('Liquid.addVisualChunk()', () => {
  it('adds a food chunk to the custom data', () => {
    const liquid = new Liquid('Potion_Medium');

    liquid.addVisualChunk('Salt');

    expect(liquid.components.LiquidContainer?.presetHash).toStrictEqual(0);
    expect(liquid.components.LiquidContainer?.isCustom).toStrictEqual(true);
    expect(liquid.components.LiquidContainer?.customData?.foodChunks).toStrictEqual([LiquidVisualChunkDefinition.Salt]);
  });
});

describe('Liquid.getColor()', () => {
  describe('when the liquid is not custom', () => {
    it('returns undefined', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            isCustom: false,
            customData: null
          })
        }
      });

      const color = liquid.getColor();

      expect(color).toStrictEqual(undefined);
    });
  });

  describe('when the color format is "hexadecimal"', () => {
    it('returns the color as a hexadecimal color code', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            isCustom: true,
            customData: {
              color: {
                r: 42,
                g: 69,
                b: 88,
                a: 0
              },
              isConsumableThroughSkin: false,
              visualDataHash: 0,
              effects: [],
              foodChunks: []
            }
          })
        }
      });

      const color = liquid.getColor('hexadecimal');

      expect(color).toStrictEqual('#2a455800');
    });
  });

  describe('when the color format is "rgba"', () => {
    it('returns the color as a ColorRGBA object', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            isCustom: true,
            customData: {
              color: {
                r: 42,
                g: 69,
                b: 88,
                a: 0
              },
              isConsumableThroughSkin: false,
              visualDataHash: 0,
              effects: [],
              foodChunks: []
            }
          })
        }
      });

      const color = liquid.getColor('rgba');

      expect(color).toStrictEqual({
        r: 42,
        g: 69,
        b: 88,
        a: 0
      });
    });
  });

  describe('when the color format is invalid', () => {
    it('throws an error', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            isCustom: true,
            customData: {
              color: {
                r: 42,
                g: 69,
                b: 88,
                a: 0
              },
              isConsumableThroughSkin: false,
              visualDataHash: 0,
              effects: [],
              foodChunks: []
            }
          })
        }
      });

      // @ts-expect-error Invalid color format.
      const expectedToThrow = () => liquid.getColor('invalid');
      const expectedError = new Error('Unsupported color format "invalid".');

      expect(expectedToThrow).toThrowError(expectedError);
    });
  });
});

describe('Liquid.getConsumableThroughSkin()', () => {
  describe('when the liquid is not custom', () => {
    it('returns false', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            isCustom: false,
            customData: null
          })
        }
      });

      const isConsumableThroughSkin = liquid.getConsumableThroughSkin();

      expect(isConsumableThroughSkin).toStrictEqual(false);
    });
  });

  describe('when the liquid is custom', () => {
    it('returns whether or not the liquid is consumable through skin', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            isCustom: true,
            customData: {
              color: {
                r: 42,
                g: 69,
                b: 88,
                a: 0
              },
              isConsumableThroughSkin: true,
              visualDataHash: 0,
              effects: [],
              foodChunks: []
            }
          })
        }
      });

      const isConsumableThroughSkin = liquid.getConsumableThroughSkin();

      expect(isConsumableThroughSkin).toStrictEqual(true);
    });
  });
});

describe('Liquid.getEffects()', () => {
  describe('when the liquid is not custom', () => {
    it('returns undefined', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            isCustom: false,
            customData: null
          })
        }
      });

      const effects = liquid.getEffects();

      expect(effects).toStrictEqual(undefined);
    });
  });

  describe('when the liquid is custom', () => {
    it('returns the effects', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            isCustom: true,
            customData: {
              color: {
                r: 42,
                g: 69,
                b: 88,
                a: 0
              },
              isConsumableThroughSkin: false,
              visualDataHash: 0,
              effects: [
                null,
                { hash: EffectDefinition.Feed, strengthMultiplier: 69 },
                { hash: EffectDefinition.Heal, strengthMultiplier: 69 },
                { hash: EffectDefinition.Nourish, strengthMultiplier: 69 },
                null,
                { hash: EffectDefinition.Heal, strengthMultiplier: 69 },
                { hash: EffectDefinition.Feed, strengthMultiplier: 69 },
                { hash: EffectDefinition.Nourish, strengthMultiplier: 69 }
              ],
              foodChunks: []
            }
          })
        }
      });

      const effects = liquid.getEffects();

      expect(effects).toStrictEqual([
        null,
        { hash: EffectDefinition.Feed, strengthMultiplier: 69 },
        { hash: EffectDefinition.Heal, strengthMultiplier: 69 },
        { hash: EffectDefinition.Nourish, strengthMultiplier: 69 },
        null,
        { hash: EffectDefinition.Heal, strengthMultiplier: 69 },
        { hash: EffectDefinition.Feed, strengthMultiplier: 69 },
        { hash: EffectDefinition.Nourish, strengthMultiplier: 69 }
      ]);
    });
  });
});

describe('Liquid.getLiquidContainerComponent()', () => {
  it('returns the LiquidContainerComponent of the liquid', () => {
    const expectedLiquidContainerComponent = new LiquidContainerComponent({
      version: 1,
      isCustom: true,
      customData: {
        color: {
          r: 42,
          g: 69,
          b: 88,
          a: 0
        },
        isConsumableThroughSkin: false,
        visualDataHash: 1337,
        effects: [{ hash: 420, strengthMultiplier: 69 }],
        foodChunks: [1337]
      }
    });

    const liquid = new Liquid('Potion_Medium', {
      components: {
        LiquidContainer: expectedLiquidContainerComponent
      }
    });

    const liquidContainerComponent = liquid.getLiquidContainerComponent();

    expect(liquidContainerComponent).toStrictEqual(expectedLiquidContainerComponent);
  });

  describe('when the LiquidContainerComponent is missing', () => {
    it('returns a new LiquidContainerComponent instance', () => {
      const liquid = new Liquid('Potion_Medium');
      liquid.removeAllComponents();

      const liquidContainerComponent = liquid.getLiquidContainerComponent();

      expect(liquidContainerComponent).toStrictEqual(new LiquidContainerComponent({ version: 1 }));
    });
  });
});

describe('Liquid.getVisualChunks()', () => {
  describe('when the liquid is not custom', () => {
    it('returns undefined', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            isCustom: false,
            customData: null
          })
        }
      });

      const visualChunks = liquid.getVisualChunks();

      expect(visualChunks).toStrictEqual(undefined);
    });
  });

  describe('when the liquid is custom', () => {
    it('returns the visual chunks', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            isCustom: true,
            customData: {
              color: {
                r: 42,
                g: 69,
                b: 88,
                a: 0
              },
              isConsumableThroughSkin: false,
              visualDataHash: 0,
              effects: [],
              foodChunks: [
                LiquidVisualChunkDefinition.BabuCooked,
                LiquidVisualChunkDefinition.Salt,
                LiquidVisualChunkDefinition.TomatoCooked,
                LiquidVisualChunkDefinition.Salt,
                LiquidVisualChunkDefinition.BabuCooked,
                LiquidVisualChunkDefinition.TomatoCooked
              ]
            }
          })
        }
      });

      const visualChunks = liquid.getVisualChunks();

      expect(visualChunks).toStrictEqual([
        LiquidVisualChunkDefinition.BabuCooked,
        LiquidVisualChunkDefinition.Salt,
        LiquidVisualChunkDefinition.TomatoCooked,
        LiquidVisualChunkDefinition.Salt,
        LiquidVisualChunkDefinition.BabuCooked,
        LiquidVisualChunkDefinition.TomatoCooked
      ]);
    });
  });
});

describe('Liquid.removeAllEffects()', () => {
  describe('when the liquid is not custom', () => {
    it('returns the liquid unaltered', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            contentLevel: 42,
            isCustom: false,
            customData: null
          })
        }
      });

      liquid.removeAllEffects();

      expect(liquid.components.LiquidContainer?.contentLevel).toStrictEqual(42);
    });
  });

  describe('when the liquid is custom', () => {
    it('removes all effects', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            isCustom: true,
            customData: {
              color: {
                r: 42,
                g: 69,
                b: 88,
                a: 0
              },
              isConsumableThroughSkin: false,
              visualDataHash: 0,
              effects: [
                { hash: 420, strengthMultiplier: 69 },
                { hash: 421, strengthMultiplier: 69 },
                { hash: 422, strengthMultiplier: 69 },
                { hash: 423, strengthMultiplier: 69 },
                { hash: 424, strengthMultiplier: 69 },
                { hash: 425, strengthMultiplier: 69 }
              ],
              foodChunks: []
            }
          })
        }
      });

      liquid.removeAllEffects();

      expect(liquid.components.LiquidContainer?.customData?.effects).toStrictEqual([]);
    });
  });
});

describe('Liquid.removeAllVisualChunks()', () => {
  describe('when the liquid is not custom', () => {
    it('returns the liquid unaltered', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            contentLevel: 42,
            isCustom: false,
            customData: null
          })
        }
      });

      liquid.removeAllVisualChunks();

      expect(liquid.components.LiquidContainer?.contentLevel).toStrictEqual(42);
    });
  });

  describe('when the liquid is custom', () => {
    it('removes all food chunks', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            isCustom: true,
            customData: {
              color: {
                r: 42,
                g: 69,
                b: 88,
                a: 0
              },
              isConsumableThroughSkin: false,
              visualDataHash: 0,
              effects: [],
              foodChunks: [420, 421, 422, 423, 424, 425]
            }
          })
        }
      });

      liquid.removeAllVisualChunks();

      expect(liquid.components.LiquidContainer?.customData?.foodChunks).toStrictEqual([]);
    });
  });
});

describe('Liquid.removeEffect()', () => {
  describe('when the liquid is not custom', () => {
    it('returns the liquid unaltered', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            contentLevel: 42,
            isCustom: false,
            customData: null
          })
        }
      });

      liquid.removeEffect('Heal');

      expect(liquid.components.LiquidContainer?.contentLevel).toStrictEqual(42);
    });
  });

  describe('when the liquid is custom', () => {
    it('removes all matching effects', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            isCustom: true,
            customData: {
              color: {
                r: 42,
                g: 69,
                b: 88,
                a: 0
              },
              isConsumableThroughSkin: false,
              visualDataHash: 0,
              effects: [
                { hash: EffectDefinition.Feed, strengthMultiplier: 69 },
                { hash: EffectDefinition.Heal, strengthMultiplier: 69 },
                { hash: EffectDefinition.Nourish, strengthMultiplier: 69 },
                { hash: EffectDefinition.Heal, strengthMultiplier: 69 },
                { hash: EffectDefinition.Feed, strengthMultiplier: 69 },
                { hash: EffectDefinition.Nourish, strengthMultiplier: 69 }
              ],
              foodChunks: []
            }
          })
        }
      });

      liquid.removeEffect('Heal');

      expect(liquid.components.LiquidContainer?.customData?.effects).toStrictEqual([
        { hash: EffectDefinition.Feed, strengthMultiplier: 69 },
        { hash: EffectDefinition.Nourish, strengthMultiplier: 69 },
        { hash: EffectDefinition.Feed, strengthMultiplier: 69 },
        { hash: EffectDefinition.Nourish, strengthMultiplier: 69 }
      ]);
    });
  });
});

describe('Liquid.removeVisualChunk()', () => {
  describe('when the liquid is not custom', () => {
    it('returns the liquid unaltered', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            contentLevel: 42,
            isCustom: false,
            customData: null
          })
        }
      });

      liquid.removeVisualChunk('Salt');

      expect(liquid.components.LiquidContainer?.contentLevel).toStrictEqual(42);
    });
  });

  describe('when the liquid is custom', () => {
    it('removes all matching food chunks', () => {
      const liquid = new Liquid('Potion_Medium', {
        components: {
          LiquidContainer: new LiquidContainerComponent({
            version: 1,
            isCustom: true,
            customData: {
              color: {
                r: 42,
                g: 69,
                b: 88,
                a: 0
              },
              isConsumableThroughSkin: false,
              visualDataHash: 0,
              effects: [],
              foodChunks: [
                LiquidVisualChunkDefinition.BabuCooked,
                LiquidVisualChunkDefinition.Salt,
                LiquidVisualChunkDefinition.TomatoCooked,
                LiquidVisualChunkDefinition.Salt,
                LiquidVisualChunkDefinition.BabuCooked,
                LiquidVisualChunkDefinition.TomatoCooked
              ]
            }
          })
        }
      });

      liquid.removeVisualChunk('Salt');

      expect(liquid.components.LiquidContainer?.customData?.foodChunks).toStrictEqual([
        LiquidVisualChunkDefinition.BabuCooked,
        LiquidVisualChunkDefinition.TomatoCooked,
        LiquidVisualChunkDefinition.BabuCooked,
        LiquidVisualChunkDefinition.TomatoCooked
      ]);
    });
  });
});

describe('Liquid.setColor()', () => {
  describe('when not passing a color argument', () => {
    it('throws an error', () => {
      const liquid = new Liquid('Potion_Medium');

      // @ts-expect-error Invalid arguments.
      const expectedToThrow = () => liquid.setColor();
      const expectedError = new Error('You must pass a color to set on this liquid.');

      expect(expectedToThrow).toThrowError(expectedError);
    });
  });

  describe('when passing a hexadecimal color code', () => {
    describe('when the passed string is not a hexadecimal color code', () => {
      it('throws an error', () => {
        const liquid = new Liquid('Potion_Medium');

        const expectedToThrow = () => liquid.setColor('invalid');
        const expectedError = new Error(
          '"invalid" is not a valid hexadecimal color code. Make sure the color you pass is 9 characters long and begins with a "#". All characters must be a number between "0" and "9" or a letter between "a" and "f".'
        );

        expect(expectedToThrow).toThrowError(expectedError);
      });
    });

    it('sets the corresponding ColorRGBA values on the LiquidContainerComponent', () => {
      const liquid = new Liquid('Potion_Medium');

      liquid.setColor('#2a455800');

      expect(liquid.components.LiquidContainer?.customData?.color).toStrictEqual({
        r: 42,
        g: 69,
        b: 88,
        a: 0
      });
    });
  });

  describe('when passing a ColorRGBA object', () => {
    it('sets the ColorRGBA values on the LiquidContainerComponent', () => {
      const liquid = new Liquid('Potion_Medium');

      liquid.setColor({
        r: 42,
        g: 69,
        b: 88,
        a: 0
      });

      expect(liquid.components.LiquidContainer?.customData?.color).toStrictEqual({
        r: 42,
        g: 69,
        b: 88,
        a: 0
      });
    });
  });
});

describe('Liquid.setConsumableThroughSkin()', () => {
  it('sets whether or not the liquid can be consumed through skin contact', () => {
    const liquid = new Liquid('Potion_Medium', {
      components: {
        LiquidContainer: new LiquidContainerComponent({
          version: 1,
          isCustom: true,
          customData: {
            color: {
              r: 42,
              g: 69,
              b: 88,
              a: 0
            },
            isConsumableThroughSkin: false,
            visualDataHash: 0,
            effects: [],
            foodChunks: []
          }
        })
      }
    });

    liquid.setConsumableThroughSkin(true);

    expect(liquid.components.LiquidContainer?.customData?.isConsumableThroughSkin).toStrictEqual(true);
  });
});

describe('Liquid.setPreset()', () => {
  describe('when not passing a presetName argument', () => {
    it('throws an error', () => {
      const liquid = new Liquid('Potion_Medium');

      // @ts-expect-error Invalid arguments.
      const expectedToThrow = () => liquid.setPreset();
      const expectedError = new Error('You must pass a preset name to set on this liquid.');

      expect(expectedToThrow).toThrowError(expectedError);
    });
  });

  it('sets the preset on the LiquidContainerComponent', () => {
    const liquid = new Liquid('Potion_Medium', {
      components: {
        LiquidContainer: new LiquidContainerComponent({
          version: 1,
          isCustom: true,
          presetHash: 1337
        })
      }
    });

    liquid.setPreset('Poison');

    expect(liquid.components.LiquidContainer?.isCustom).toStrictEqual(false);
    expect(liquid.components.LiquidContainer?.presetHash).toStrictEqual(LiquidDefinition.Poison);
  });
});

describe('Liquid.setVisualAppearance()', () => {
  describe('when not passing a presetName argument', () => {
    it('throws an error', () => {
      const liquid = new Liquid('Potion_Medium');

      // @ts-expect-error Invalid arguments.
      const expectedToThrow = () => liquid.setVisualAppearance();
      const expectedError = new Error('You must pass a visual appearance name to set on this liquid.');

      expect(expectedToThrow).toThrowError(expectedError);
    });
  });

  it('sets the preset on the LiquidContainerComponent', () => {
    const liquid = new Liquid('Potion_Medium', {
      components: {
        LiquidContainer: new LiquidContainerComponent({
          version: 1,
          isCustom: false
        })
      }
    });

    liquid.setVisualAppearance('Teleport');

    expect(liquid.components.LiquidContainer?.isCustom).toStrictEqual(true);
    expect(liquid.components.LiquidContainer?.customData?.visualDataHash).toStrictEqual(LiquidVisualData.Teleport);
  });
});
