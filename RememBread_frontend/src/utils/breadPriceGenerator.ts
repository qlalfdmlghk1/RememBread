interface Bread {
  name: string;
  price: number;
  type: string;
}

export const getRandomPrice = (existingPrices: number[]): number => {
  const min = 1000;
  const max = 5000;
  const step = 500;
  const possiblePrices = [];
  
  for (let price = min; price <= max; price += step) {
    if (!existingPrices.includes(price)) {
      possiblePrices.push(price);
    }
  }
  
  return possiblePrices[Math.floor(Math.random() * possiblePrices.length)];
}

export const generateNewBreadPrices = (breads: Bread[]): Bread[] => {
  const newPrices: number[] = [];
  return breads.map(bread => {
    const newPrice = getRandomPrice(newPrices);
    newPrices.push(newPrice);
    return { ...bread, price: newPrice };
  });
}

export const initialBreads: Bread[] = [
  { name: "식빵", price: 2000, type: "bread" },
  { name: "바게트", price: 3000, type: "baguette" },
  { name: "크로와상", price: 5000, type: "croissant" }
]; 