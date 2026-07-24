import testData from './test-data.json';

export interface ProductData {
  backpack: string;
  bikeLight: string;
  boltTShirt: string;
  fleeceJacket: string;
}

export interface CustomerData {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface CartScenarioData {
  name: string;
  productKeys: string[];
  expectedCartCount: number;
  expectedItems?: string[];
  goToCart?: boolean;
  tags: string[];
}

export interface SortingScenarioData {
  name: string;
  sortBy: 'az' | 'za' | 'lohi' | 'hilo';
  valueType: 'price' | 'name';
  tags: string[];
}

export interface CheckoutScenarioData {
  name: string;
  productKeys: string[];
  expectedCartCount: number;
  customerKey: string;
  expectedConfirmation?: string;
  expectErrorVisible?: boolean;
  tags: string[];
}

export interface TestDataShape {
  products: ProductData;
  customers: Record<string, CustomerData>;
  cartScenarios: CartScenarioData[];
  sortingScenarios: SortingScenarioData[];
  checkoutScenarios: CheckoutScenarioData[];
}

const data = testData as TestDataShape;

const resolveProductNames = (productKeys: string[]): string[] => {
  return productKeys.map((key) => data.products[key as keyof ProductData]);
};

export const productData = data.products;
export const customerData = data.customers.default;
export const cartScenarios = data.cartScenarios.map((scenario) => ({
  ...scenario,
  productNames: resolveProductNames(scenario.productKeys),
}));
export const sortingScenarios = data.sortingScenarios;
export const checkoutScenarios = data.checkoutScenarios.map((scenario) => ({
  ...scenario,
  productNames: resolveProductNames(scenario.productKeys),
}));
