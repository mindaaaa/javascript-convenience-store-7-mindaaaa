import { PromotionType } from '../../utils/constants.js';
import NBuyGetOnePromotion from './NBuyGetOnePromotion.js';
import NoneStrategy from './NoneStrategy.js';

const Strategy = {
  [PromotionType.TWO_PLUS_ONE]: new XPlusOnePromotion(2),
  [PromotionType.MD_RECOMMEND]: new XPlusOnePromotion(1),
  [PromotionType.TIME_SALE]: new XPlusOnePromotion(1),
  [PromotionType.NONE]: NoneStrategy,
};

export default {
  from(type) {
    if (!Reflect.has(Strategy, type)) {
      throw new Error('[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.');
    }

    return Reflect.get(Strategy, type);
  },
};
