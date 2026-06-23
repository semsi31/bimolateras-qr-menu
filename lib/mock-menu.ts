import { IMAGE_CDN_BASE } from "@/lib/constants";

export type MenuCategory = {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  featuredOnly?: boolean;
};

export type MenuProduct = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  updatedAt?: string;
  isActive?: boolean;
  isPopular: boolean;
  isNew: boolean;
  isAvailable: boolean;
  sortOrder: number;
};

const productImage = (fileName: string) =>
  `${IMAGE_CDN_BASE}/products/${fileName}`;

export const menuCategories: MenuCategory[] = [
  {
    id: "featured",
    name: "Öne Çıkanlar",
    description: "Bİ'MOLA misafirlerinin en sevdiği lezzetler.",
    sortOrder: 0,
    featuredOnly: true,
  },
  {
    id: "coffee",
    name: "Kahveler",
    description: "Klasik ve imza kahveler.",
    sortOrder: 1,
  },
  {
    id: "cold-drinks",
    name: "Soğuk İçecekler",
    description: "Ferahlatan soğuk içecek seçenekleri.",
    sortOrder: 2,
  },
  {
    id: "hot-drinks",
    name: "Sıcak İçecekler",
    description: "Sohbete eşlik eden sıcak içecekler.",
    sortOrder: 3,
  },
  {
    id: "desserts",
    name: "Tatlılar",
    description: "Kahve yanına tatlı molalar.",
    sortOrder: 4,
  },
  {
    id: "snacks",
    name: "Aperatifler",
    description: "Hafif atıştırmalıklar.",
    sortOrder: 5,
  },
  {
    id: "breakfast",
    name: "Kahvaltı",
    description: "Güne keyifli başlamak için.",
    sortOrder: 6,
  },
];

export const menuProducts: MenuProduct[] = [
  {
    id: "latte",
    categoryId: "coffee",
    name: "Latte",
    description: "Espresso ve sıcak süt ile yumuşak içimli klasik kahve.",
    price: 85,
    imageUrl: productImage("latte.webp"),
    isPopular: true,
    isNew: false,
    isAvailable: true,
    sortOrder: 1,
  },
  {
    id: "americano",
    categoryId: "coffee",
    name: "Americano",
    description: "Yoğun espresso tadını sade ve dengeli sevenlere.",
    price: 75,
    imageUrl: productImage("americano.webp"),
    isPopular: false,
    isNew: false,
    isAvailable: true,
    sortOrder: 2,
  },
  {
    id: "mocha",
    categoryId: "coffee",
    name: "Mocha",
    description: "Espresso, süt ve çikolatanın sıcak buluşması.",
    price: 95,
    imageUrl: productImage("mocha.webp"),
    isPopular: true,
    isNew: false,
    isAvailable: true,
    sortOrder: 3,
  },
  {
    id: "turkish-coffee",
    categoryId: "coffee",
    name: "Türk Kahvesi",
    description: "Geleneksel sunumuyla bol köpüklü Türk kahvesi.",
    price: 70,
    imageUrl: productImage("turk-kahvesi.webp"),
    isPopular: false,
    isNew: false,
    isAvailable: true,
    sortOrder: 4,
  },
  {
    id: "ice-latte",
    categoryId: "cold-drinks",
    name: "Ice Latte",
    description: "Soğuk süt ve espresso ile ferahlatıcı kahve molası.",
    price: 95,
    imageUrl: productImage("ice-latte.webp"),
    isPopular: true,
    isNew: false,
    isAvailable: true,
    sortOrder: 1,
  },
  {
    id: "lemonade",
    categoryId: "cold-drinks",
    name: "Limonata",
    description: "Taze, ferah ve dengeli limon aroması.",
    price: 80,
    imageUrl: productImage("limonata.webp"),
    isPopular: false,
    isNew: true,
    isAvailable: true,
    sortOrder: 2,
  },
  {
    id: "berry-cooler",
    categoryId: "cold-drinks",
    name: "Orman Meyveli Cooler",
    description: "Meyve aromalarıyla hafif ve serinletici özel içecek.",
    price: 105,
    imageUrl: productImage("berry-cooler.webp"),
    isPopular: false,
    isNew: true,
    isAvailable: false,
    sortOrder: 3,
  },
  {
    id: "tea",
    categoryId: "hot-drinks",
    name: "Çay",
    description: "Demli, taze ve sohbetlik ince belli çay.",
    price: 25,
    imageUrl: productImage("cay.webp"),
    isPopular: false,
    isNew: false,
    isAvailable: true,
    sortOrder: 1,
  },
  {
    id: "sahlep",
    categoryId: "hot-drinks",
    name: "Sahlep",
    description: "Tarçın dokunuşuyla sıcak ve kremamsı kış lezzeti.",
    price: 75,
    imageUrl: productImage("sahlep.webp"),
    isPopular: false,
    isNew: true,
    isAvailable: true,
    sortOrder: 2,
  },
  {
    id: "cheesecake",
    categoryId: "desserts",
    name: "Cheesecake",
    description: "Kahveyle uyumlu, yoğun ve ipeksi tatlı dilimi.",
    price: 120,
    imageUrl: productImage("cheesecake.webp"),
    isPopular: true,
    isNew: false,
    isAvailable: true,
    sortOrder: 1,
  },
  {
    id: "brownie",
    categoryId: "desserts",
    name: "Brownie",
    description: "Yoğun çikolatalı, sıcak servis edilebilen tatlı.",
    price: 110,
    imageUrl: productImage("brownie.webp"),
    isPopular: false,
    isNew: false,
    isAvailable: true,
    sortOrder: 2,
  },
  {
    id: "toast",
    categoryId: "snacks",
    name: "Karışık Tost",
    description: "Kaşar ve sucukla hazırlanan sıcak, çıtır tost.",
    price: 110,
    imageUrl: productImage("tost.webp"),
    isPopular: false,
    isNew: false,
    isAvailable: true,
    sortOrder: 1,
  },
  {
    id: "fries",
    categoryId: "snacks",
    name: "Patates Kızartması",
    description: "Baharatlı, çıtır ve paylaşmalık aperatif.",
    price: 95,
    imageUrl: productImage("patates.webp"),
    isPopular: true,
    isNew: false,
    isAvailable: true,
    sortOrder: 2,
  },
  {
    id: "breakfast-plate",
    categoryId: "breakfast",
    name: "Bİ'MOLA Kahvaltı Tabağı",
    description: "Peynir, zeytin, reçel ve taze ürünlerle sade kahvaltı.",
    price: 210,
    imageUrl: productImage("kahvalti-tabagi.webp"),
    isPopular: false,
    isNew: true,
    isAvailable: true,
    sortOrder: 1,
  },
];

export const getProductsForCategory = (category: MenuCategory) => {
  const products = category.featuredOnly
    ? menuProducts.filter(
        (product) => (product.isActive ?? true) && product.isPopular === true
      )
    : menuProducts.filter(
        (product) =>
          (product.isActive ?? true) && product.categoryId === category.id
      );

  return [...products].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)
  );
};

export const adminCategories = menuCategories
  .filter((category) => !category.featuredOnly)
  .sort((a, b) => a.sortOrder - b.sortOrder);

export const getCategoryName = (categoryId: string) =>
  adminCategories.find((category) => category.id === categoryId)?.name ??
  "Kategorisiz";

export const getProductCountByCategory = (categoryId: string) =>
  menuProducts.filter((product) => product.categoryId === categoryId).length;

export const getAdminMenuStats = () => ({
  totalProducts: menuProducts.length,
  activeProducts: menuProducts.filter((product) => product.isActive ?? true)
    .length,
  categoryCount: adminCategories.length,
  unavailableProducts: menuProducts.filter((product) => !product.isAvailable)
    .length,
});

export const getRecentProducts = (limit = 5) =>
  [...menuProducts]
    .sort((a, b) => b.sortOrder - a.sortOrder)
    .slice(0, limit);
