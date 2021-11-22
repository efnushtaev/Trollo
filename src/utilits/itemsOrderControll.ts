export class ItemsOrderControll {
  up<T extends { order: number }>(currentOrder: number, itemsList: T[]) {
    const itemsListLength = itemsList.length || 1
    let newItemsList: T[]
    if (currentOrder === 1) {
      // TODO add explenation comments
      // крайнее положение сортируемого объекта
      newItemsList = itemsList.map(item =>
        item.order === 1 ? { ...item, order: itemsListLength } : { ...item, order: item.order - 1 }
      )
    } else {
      newItemsList = itemsList.map(item => {
        if (item.order === currentOrder) {
          return { ...item, order: item.order - 1 }
        } else if (item.order === currentOrder - 1) {
          return { ...item, order: item.order + 1 }
        } else return item
      })
    }
    return newItemsList
  }

  down<T extends { order: number }>(currentOrder: number, itemsList: T[]) {
    const itemsListLength = itemsList.length || 1
    let newItemsList: T[]
    if (currentOrder === itemsListLength) {
      // крайнее положение сортируемого объекта
      newItemsList = itemsList.map(item =>
        item.order === itemsListLength ? { ...item, order: 1 } : { ...item, order: item.order + 1 }
      )
    } else {
      newItemsList = itemsList.map(item => {
        if (item.order === currentOrder) {
          return { ...item, order: item.order + 1 }
        } else if (item.order === currentOrder + 1) {
          return { ...item, order: item.order - 1 }
        } else return item
      })
    }
    return newItemsList
  }

  reorder<T extends { order: number }>(list: T[]): T[] {
    return list.map((item: T, index: number) => ({ ...item, order: index + 1 }))
  }

  sort<T extends { order: number }>(list: T[], direction: 'reverse' | 'normal' = 'normal'): T[] {
    return list.sort((a, b) => (direction === 'reverse' ? b.order - a.order : a.order - b.order))
  }
}
