export class List<T> {
  private items: Map<number, T> = new Map<number, T>();
  private currentIndex: number = 0;

  // Add an item to the list
  add(item: T): void {
    this.items.set(this.currentIndex, item);
    this.currentIndex++;
  }

  // Add an item at a specific index
  addAt(index: number, item: T): void {
    this.items.set(index, item);

    if (this.currentIndex < index) {
      this.currentIndex = index;
    }
  }

  // Get an item at a specific index
  get(index: number): T {
    if (this.items.has(index) === true) {
      return this.items.get(index);
    } else {
      throw new Error('Index out of bounds');
    }
  }

  // Remove an item at a specific index
  removeAt(index: number): boolean {
    if (this.items.has(index)) {
      this.items.delete(index);
      return true;
    }
    return false;
  }

  // Remove a specific item from the list
  remove(item: T): boolean {
    // Find the key corresponding to the item in the Map
    for (const [key, value] of this.items.entries()) {
      if (value === item) {
        // If the item is found, delete it by key
        this.items.delete(key);
        return true;
      }
    }

    // If no item was found, return false
    return false;
  }

  // Check if the list contains a specific item
  contains(item: T): boolean {
    // Iterate over the values in the Map
    for (const value of this.items.values()) {
      if (value === item) {
        return true; // If item is found, return true
      }
    }
    return false; // If item is not found, return false
  }

  // Get the size of the list
  get size(): number {
    return this.items.size;
  }

  // Clear the list
  clear(): void {
    this.items.clear();
    this.currentIndex = 0;
  }

  // Get all items as an array
  toArray(): Array<T> {
    return Array.from(this.items.values());
  }

  // Iterate over the list
  forEach(callback: (item: T, index: number) => void): void {
    this.items.forEach(callback);
  }
}
