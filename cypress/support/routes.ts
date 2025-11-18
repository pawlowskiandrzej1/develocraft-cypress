export const Routes = {
  HOME: '/',
  MY_ACCOUNT: '/my-account/',
  CART: '/cart/',
  SHOP: '/shop/',
  SEARCH: (term: string) => `/?s=${term}&post_type=product`,
} as const;

