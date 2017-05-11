import { LanzaroteSummerChallengePage } from './app.po';

describe('lanzarote-summer-challenge App', () => {
  let page: LanzaroteSummerChallengePage;

  beforeEach(() => {
    page = new LanzaroteSummerChallengePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
