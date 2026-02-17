import { validateCreatePromotion, validateUpdatePromotion, validateId } from './promotions.validation';
import { Promotion } from '../types/promotions.types';
import { ApiError } from '../utils/ApiError';

describe('Validation Tests', () => {
  describe('validateCreatePromotion', () => {
    const validBasePromotion: Promotion = {
      promo_code: 'TEST123',
      title: 'Test Promotion',
      type: 'PERCENTAGE',
      value: 10,
      start_at: '2026-01-01T00:00:00Z',
      end_at: '2026-12-31T23:59:59Z',
    };

    describe('Required Fields', () => {
      test('should throw error when promo_code is missing', () => {
        const promo = { ...validBasePromotion, promo_code: '' };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Promo code is required');
      });

      test('should throw error when title is missing', () => {
        const promo = { ...validBasePromotion, title: '' };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Title is required');
      });

      test('should throw error when type is missing', () => {
        const promo = { ...validBasePromotion, type: '' as any };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Invalid discount type');
      });

      test('should throw error when start_at is missing', () => {
        const promo = { ...validBasePromotion, start_at: '' };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Start date is required');
      });

      test('should throw error when end_at is missing', () => {
        const promo = { ...validBasePromotion, end_at: '' };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('End date is required');
      });
    });

    describe('Discount Type Validation', () => {
      test('should accept PERCENTAGE type', () => {
        const promo = { ...validBasePromotion, type: 'PERCENTAGE' as const };
        expect(() => validateCreatePromotion(promo)).not.toThrow();
      });

      test('should accept FIXED type', () => {
        const promo = { ...validBasePromotion, type: 'FIXED' as const };
        expect(() => validateCreatePromotion(promo)).not.toThrow();
      });

      test('should accept CUSTOM type with valid custom_items', () => {
        const promo: Promotion = {
          ...validBasePromotion,
          type: 'CUSTOM',
          value: 0,
          custom_items: [
            {
              item_id: 'item1',
              discount_type: 'PERCENTAGE',
              discount_value: 10,
            },
          ],
        };
        expect(() => validateCreatePromotion(promo)).not.toThrow();
      });

      test('should throw error for invalid discount type', () => {
        const promo = { ...validBasePromotion, type: 'INVALID' as any };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Invalid discount type');
      });
    });

    describe('Value Validation for PERCENTAGE and FIXED types', () => {
      test('should throw error when value is missing for PERCENTAGE type', () => {
        const promo = { ...validBasePromotion, type: 'PERCENTAGE' as const, value: 0 };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Value must be greater than 0');
      });

      test('should throw error when value is negative for FIXED type', () => {
        const promo = { ...validBasePromotion, type: 'FIXED' as const, value: -10 };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Value must be greater than 0');
      });

      test('should accept positive value for PERCENTAGE type', () => {
        const promo = { ...validBasePromotion, type: 'PERCENTAGE' as const, value: 15 };
        expect(() => validateCreatePromotion(promo)).not.toThrow();
      });

      test('should accept positive value for FIXED type', () => {
        const promo = { ...validBasePromotion, type: 'FIXED' as const, value: 100 };
        expect(() => validateCreatePromotion(promo)).not.toThrow();
      });
    });

    describe('Date Range Validation', () => {
      test('should throw error when start_at is after end_at', () => {
        const promo = {
          ...validBasePromotion,
          start_at: '2026-12-31T23:59:59Z',
          end_at: '2026-01-01T00:00:00Z',
        };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Start date must be before end date');
      });

      test('should throw error when start_at equals end_at', () => {
        const promo = {
          ...validBasePromotion,
          start_at: '2026-06-01T00:00:00Z',
          end_at: '2026-06-01T00:00:00Z',
        };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Start date must be before end date');
      });

      test('should accept valid date range', () => {
        const promo = {
          ...validBasePromotion,
          start_at: '2026-01-01T00:00:00Z',
          end_at: '2026-12-31T23:59:59Z',
        };
        expect(() => validateCreatePromotion(promo)).not.toThrow();
      });
    });

    describe('CUSTOM Type Validation', () => {
      test('should throw error when custom_items is missing for CUSTOM type', () => {
        const promo: Promotion = {
          ...validBasePromotion,
          type: 'CUSTOM',
          value: 0,
        };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Custom items are required');
      });

      test('should throw error when custom_items is empty array', () => {
        const promo: Promotion = {
          ...validBasePromotion,
          type: 'CUSTOM',
          value: 0,
          custom_items: [],
        };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Custom items are required');
      });

      test('should throw error when custom item is missing item_id', () => {
        const promo: Promotion = {
          ...validBasePromotion,
          type: 'CUSTOM',
          value: 0,
          custom_items: [
            {
              item_id: '',
              discount_type: 'PERCENTAGE',
              discount_value: 10,
            },
          ],
        };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Item ID required for custom item 1');
      });

      test('should throw error when custom item has invalid discount_type', () => {
        const promo: Promotion = {
          ...validBasePromotion,
          type: 'CUSTOM',
          value: 0,
          custom_items: [
            {
              item_id: 'item1',
              discount_type: 'INVALID' as any,
              discount_value: 10,
            },
          ],
        };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Invalid discount type for item 1');
      });

      test('should throw error when custom item has zero discount_value', () => {
        const promo: Promotion = {
          ...validBasePromotion,
          type: 'CUSTOM',
          value: 0,
          custom_items: [
            {
              item_id: 'item1',
              discount_type: 'PERCENTAGE',
              discount_value: 0,
            },
          ],
        };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Discount value must be greater than 0 for item 1');
      });

      test('should throw error when custom item has negative discount_value', () => {
        const promo: Promotion = {
          ...validBasePromotion,
          type: 'CUSTOM',
          value: 0,
          custom_items: [
            {
              item_id: 'item1',
              discount_type: 'PERCENTAGE',
              discount_value: -10,
            },
          ],
        };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Discount value must be greater than 0 for item 1');
      });

      test('should accept valid custom items', () => {
        const promo: Promotion = {
          ...validBasePromotion,
          type: 'CUSTOM',
          value: 0,
          custom_items: [
            {
              item_id: 'item1',
              discount_type: 'PERCENTAGE',
              discount_value: 10,
            },
            {
              item_id: 'item2',
              discount_type: 'FIXED',
              discount_value: 50,
            },
          ],
        };
        expect(() => validateCreatePromotion(promo)).not.toThrow();
      });
    });

    describe('Combo Validation', () => {
      test('should throw error when combo has less than 2 items', () => {
        const promo: Promotion = {
          ...validBasePromotion,
          type: 'CUSTOM',
          value: 0,
          custom_items: [
            {
              item_id: 'item1',
              discount_type: 'PERCENTAGE',
              discount_value: 10,
            },
          ],
          combos: [
            {
              item_ids: ['item1'],
              discount_type: 'PERCENTAGE',
              discount_value: 20,
            },
          ],
        };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Combo 1 must have at least 2 items');
      });

      test('should throw error when combo has invalid discount_type', () => {
        const promo: Promotion = {
          ...validBasePromotion,
          type: 'CUSTOM',
          value: 0,
          custom_items: [
            {
              item_id: 'item1',
              discount_type: 'PERCENTAGE',
              discount_value: 10,
            },
          ],
          combos: [
            {
              item_ids: ['item1', 'item2'],
              discount_type: 'INVALID' as any,
              discount_value: 20,
            },
          ],
        };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Invalid discount type for combo 1');
      });

      test('should throw error when combo has zero discount_value', () => {
        const promo: Promotion = {
          ...validBasePromotion,
          type: 'CUSTOM',
          value: 0,
          custom_items: [
            {
              item_id: 'item1',
              discount_type: 'PERCENTAGE',
              discount_value: 10,
            },
          ],
          combos: [
            {
              item_ids: ['item1', 'item2'],
              discount_type: 'PERCENTAGE',
              discount_value: 0,
            },
          ],
        };
        expect(() => validateCreatePromotion(promo)).toThrow(ApiError);
        expect(() => validateCreatePromotion(promo)).toThrow('Discount value must be greater than 0 for combo 1');
      });

      test('should accept valid combos', () => {
        const promo: Promotion = {
          ...validBasePromotion,
          type: 'CUSTOM',
          value: 0,
          custom_items: [
            {
              item_id: 'item1',
              discount_type: 'PERCENTAGE',
              discount_value: 10,
            },
          ],
          combos: [
            {
              item_ids: ['item1', 'item2'],
              discount_type: 'PERCENTAGE',
              discount_value: 20,
            },
            {
              item_ids: ['item3', 'item4', 'item5'],
              discount_type: 'FIXED',
              discount_value: 100,
            },
          ],
        };
        expect(() => validateCreatePromotion(promo)).not.toThrow();
      });
    });
  });

  describe('validateUpdatePromotion', () => {
    test('should accept empty update object', () => {
      expect(() => validateUpdatePromotion({})).not.toThrow();
    });

    test('should throw error for invalid discount type', () => {
      expect(() => validateUpdatePromotion({ type: 'INVALID' as any })).toThrow(ApiError);
      expect(() => validateUpdatePromotion({ type: 'INVALID' as any })).toThrow('Invalid discount type');
    });

    test('should accept valid discount types', () => {
      expect(() => validateUpdatePromotion({ type: 'PERCENTAGE' })).not.toThrow();
      expect(() => validateUpdatePromotion({ type: 'FIXED' })).not.toThrow();
      expect(() => validateUpdatePromotion({ type: 'CUSTOM' })).not.toThrow();
    });

    test('should throw error when custom_items is empty array', () => {
      expect(() => validateUpdatePromotion({ custom_items: [] })).toThrow(ApiError);
      expect(() => validateUpdatePromotion({ custom_items: [] })).toThrow('Custom items must be a non-empty array');
    });

    test('should throw error when custom item is missing item_id', () => {
      const update = {
        custom_items: [
          {
            item_id: '',
            discount_type: 'PERCENTAGE' as const,
            discount_value: 10,
          },
        ],
      };
      expect(() => validateUpdatePromotion(update)).toThrow(ApiError);
      expect(() => validateUpdatePromotion(update)).toThrow('Item ID required for custom item 1');
    });

    test('should throw error when custom item has invalid discount_type', () => {
      const update = {
        custom_items: [
          {
            item_id: 'item1',
            discount_type: 'INVALID' as any,
            discount_value: 10,
          },
        ],
      };
      expect(() => validateUpdatePromotion(update)).toThrow(ApiError);
      expect(() => validateUpdatePromotion(update)).toThrow('Invalid discount type for item 1');
    });

    test('should throw error when custom item has invalid discount_value', () => {
      const update = {
        custom_items: [
          {
            item_id: 'item1',
            discount_type: 'PERCENTAGE' as const,
            discount_value: 0,
          },
        ],
      };
      expect(() => validateUpdatePromotion(update)).toThrow(ApiError);
      expect(() => validateUpdatePromotion(update)).toThrow('Discount value must be greater than 0 for item 1');
    });

    test('should accept valid custom_items', () => {
      const update = {
        custom_items: [
          {
            item_id: 'item1',
            discount_type: 'PERCENTAGE' as const,
            discount_value: 10,
          },
        ],
      };
      expect(() => validateUpdatePromotion(update)).not.toThrow();
    });

    test('should throw error when value is negative for non-CUSTOM type', () => {
      expect(() => validateUpdatePromotion({ value: -10, type: 'PERCENTAGE' })).toThrow(ApiError);
      expect(() => validateUpdatePromotion({ value: -10, type: 'PERCENTAGE' })).toThrow('Value must be greater than 0');
    });

    test('should throw error when value is zero for non-CUSTOM type', () => {
      expect(() => validateUpdatePromotion({ value: 0, type: 'FIXED' })).toThrow(ApiError);
      expect(() => validateUpdatePromotion({ value: 0, type: 'FIXED' })).toThrow('Value must be greater than 0');
    });

    test('should accept zero value for CUSTOM type', () => {
      expect(() => validateUpdatePromotion({ value: 0, type: 'CUSTOM' })).not.toThrow();
    });

    test('should accept positive value for non-CUSTOM type', () => {
      expect(() => validateUpdatePromotion({ value: 10, type: 'PERCENTAGE' })).not.toThrow();
      expect(() => validateUpdatePromotion({ value: 100, type: 'FIXED' })).not.toThrow();
    });

    test('should throw error for invalid date range', () => {
      const update = {
        start_at: '2026-12-31T23:59:59Z',
        end_at: '2026-01-01T00:00:00Z',
      };
      expect(() => validateUpdatePromotion(update)).toThrow(ApiError);
      expect(() => validateUpdatePromotion(update)).toThrow('Start date must be before end date');
    });

    test('should accept valid date range', () => {
      const update = {
        start_at: '2026-01-01T00:00:00Z',
        end_at: '2026-12-31T23:59:59Z',
      };
      expect(() => validateUpdatePromotion(update)).not.toThrow();
    });

    test('should throw error for empty promo_code', () => {
      expect(() => validateUpdatePromotion({ promo_code: '   ' })).toThrow(ApiError);
      expect(() => validateUpdatePromotion({ promo_code: '   ' })).toThrow('Promo code cannot be empty');
    });

    test('should throw error for empty title', () => {
      expect(() => validateUpdatePromotion({ title: '   ' })).toThrow(ApiError);
      expect(() => validateUpdatePromotion({ title: '   ' })).toThrow('Title cannot be empty');
    });

    test('should accept valid promo_code and title', () => {
      expect(() => validateUpdatePromotion({ promo_code: 'VALID123' })).not.toThrow();
      expect(() => validateUpdatePromotion({ title: 'Valid Title' })).not.toThrow();
    });

    test('should validate combos when provided', () => {
      const update = {
        combos: [
          {
            item_ids: ['item1'],
            discount_type: 'PERCENTAGE' as const,
            discount_value: 20,
          },
        ],
      };
      expect(() => validateUpdatePromotion(update)).toThrow(ApiError);
      expect(() => validateUpdatePromotion(update)).toThrow('Combo 1 must have at least 2 items');
    });

    test('should accept valid combos', () => {
      const update = {
        combos: [
          {
            item_ids: ['item1', 'item2'],
            discount_type: 'PERCENTAGE' as const,
            discount_value: 20,
          },
        ],
      };
      expect(() => validateUpdatePromotion(update)).not.toThrow();
    });
  });

  describe('validateId', () => {
    test('should throw error for zero id', () => {
      expect(() => validateId(0)).toThrow(ApiError);
      expect(() => validateId(0)).toThrow('Invalid ID');
    });

    test('should throw error for negative id', () => {
      expect(() => validateId(-1)).toThrow(ApiError);
      expect(() => validateId(-1)).toThrow('Invalid ID');
    });

    test('should throw error for NaN', () => {
      expect(() => validateId(NaN)).toThrow(ApiError);
      expect(() => validateId(NaN)).toThrow('Invalid ID');
    });

    test('should accept positive id', () => {
      expect(() => validateId(1)).not.toThrow();
      expect(() => validateId(100)).not.toThrow();
      expect(() => validateId(999999)).not.toThrow();
    });
  });
});
