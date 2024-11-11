import { ERROR_MESSAGES, PromotionType } from '../../utils/constants.js';
import NBuyGetOnePromotion from './NBuyGetOnePromotion.js';
import NoneStrategy from './NoneStrategy.js';

const Strategy = {
  [PromotionType.TWO_PLUS_ONE]: new NBuyGetOnePromotion(2),
  [PromotionType.MD_RECOMMEND]: new NBuyGetOnePromotion(1),
  [PromotionType.TIME_SALE]: new NBuyGetOnePromotion(1),
  [PromotionType.NONE]: NoneStrategy,
};

export default {
  from(type) {
    if (!Reflect.has(Strategy, type)) {
      throw new Error(ERROR_MESSAGES.INVALID_INPUT);
    }

    return Reflect.get(Strategy, type);
  },
};
