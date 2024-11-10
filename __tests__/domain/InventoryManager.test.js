import { MissionUtils } from '@woowacourse/mission-utils';
import InventoryManager from '../../src/domain/InventoryManager.js';
import Cashier from '../../src/services/Cashier.js';
import InputHandler from '../../src/views/InputHandler.js';
import { EOL as LINE_SEPARATOR } from 'os';

const mockNowDate = (date = null) => {
  const mockDateTimes = jest.spyOn(MissionUtils.DateTimes, 'now');
  mockDateTimes.mockReturnValue(new Date(date));
  return mockDateTimes;
};

jest.mock('../../src/domain/InventoryManager.js');
jest.mock('../../src/views/InputHandler.js');

describe('Cashier의 handlePurchase 메서드를 테스트한다.', () => {
  let mockInventory;
  let cashier;

  beforeEach(() => {
    mockInventory = new InventoryManager();
    cashier = new Cashier(mockInventory);

    mockInventory.getPromProduct.mockImplementation((name) => {
      if (name === '콜라')
        return { name: '콜라', quantity: 10, promotion: '탄산2+1' };
      if (name === '사이다')
        return { name: '사이다', quantity: 8, promotion: 'MD추천상품' };
      return null;
    });
    mockInventory.getRegularProduct.mockImplementation((name) => {
      return { name, quantity: 15, promotion: null };
    });

    jest.spyOn(InputHandler, 'askForConfirmation');
    mockNowDate('2024-11-10T00:00:00.000Z');
  });

  test('2+1 프로모션의 추가 증정을 수락한다.', async () => {
    // given
    InputHandler.askForConfirmation.mockResolvedValue(true);

    // when
    const result = await cashier.handlePurchase([
      { name: '콜라', quantity: 5 },
    ]);

    // then
    expect(result).toEqual([
      { name: '콜라', quantity: 7, promotion: '탄산2+1' },
    ]);
    expect(mockInventory.getPromProduct).toHaveBeenCalledWith('콜라');
  });

  test('2+1 프로모션의 추가 증정을 거부한다.', async () => {
    // given
    InputHandler.askForConfirmation.mockResolvedValue(false);

    // when
    const result = await cashier.handlePurchase([
      { name: '콜라', quantity: 5 },
    ]);

    // then
    expect(result).toEqual([
      { name: '콜라', quantity: 5, promotion: '탄산2+1' },
    ]);
    expect(mockInventory.getPromProduct).toHaveBeenCalledWith('콜라');
  });

  test('프로모션 재고가 부족할 때 정가 결제 수락 여부를 테스트한다.', async () => {
    // given
    InputHandler.askForConfirmation
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    // when
    const result = await cashier.handlePurchase([
      { name: '사이다', quantity: 6 },
    ]);

    // then
    expect(result).toEqual([
      { name: '사이다', quantity: 6, promotion: 'MD추천상품' },
    ]);
    expect(mockInventory.getPromProduct).toHaveBeenCalledWith('사이다');
    expect(cashier.applyRegularDeduction).toHaveBeenCalled();
  });

  test('일반 재고만 있는 경우에 구매를 처리한다', async () => {
    // given
    const productName = '에너지바';
    const requestedQuantity = 4;

    // when
    const result = await cashier.handlePurchase([
      { name: productName, quantity: requestedQuantity },
    ]);

    // then
    expect(result).toEqual([
      { name: productName, quantity: requestedQuantity, promotion: null },
    ]);
    expect(mockInventory.getRegularProduct).toHaveBeenCalledWith(productName);
  });
});
