let listContainer: HTMLDivElement | null;
let draggableItem: HTMLDivElement | null;
let pointerStartX: number;
let pointerStartY: number;
let items = [] as Array<HTMLDivElement>;

export function setup() {
  listContainer = document.querySelector('.list');
  if (!listContainer) return;

  listContainer.addEventListener('mousedown', dragStart);
  document.addEventListener('mouseup', dragEnd);
}

function dragStart(e: Event) {
  console.log('drag start');
  if ((e.target as HTMLDivElement).classList.contains('drag-handle')) {
    draggableItem = (e.target as HTMLDivElement).closest('.item');
  }
  if (!draggableItem) return;
  pointerStartX = (e as MouseEvent).clientX;
  pointerStartY = (e as MouseEvent).clientY;
  initDraggableItem();
  initItemState();

  document.addEventListener('mousemove', drag);
}

function drag(e: MouseEvent) {
  if (!draggableItem) return;
  console.log('drag');

  const currentPositionX = e.clientX;
  const currentPositionY = e.clientY;

  const pointerOffsetX = currentPositionX - pointerStartX;
  const pointerOffsetY = currentPositionY - pointerStartY;
  draggableItem.style.transform = `translate(${pointerOffsetX}px, ${pointerOffsetY}px)`;
  updateIdleItemStatePosition();
}

function dragEnd() {
  console.log('drag end');
  applyNewItemOrder();
  items = [];
  unsetDraggableItem();
  unsetItemState();

  document.removeEventListener('mousemove', drag);
}

function initDraggableItem() {
  draggableItem?.classList.remove('is-idle');
  draggableItem?.classList.add('is-draggable');
}

function unsetDraggableItem() {
  if (draggableItem) {
    draggableItem.style.transform = '';
    draggableItem?.classList.remove('is-draggable');
    draggableItem.classList.add('is-idle');
    draggableItem = null;
  }
}

function initItemState() {
  getIdleItems().forEach((item, i) => {
    if (getAllItems().indexOf(draggableItem as HTMLDivElement) > i) {
      item.dataset.isAbove = '';
    }
  });
}

function getAllItems() {
  if (!items.length && listContainer) {
    items = Array.from(listContainer.querySelectorAll('.item'));
  }
  return items;
}

function getIdleItems() {
  return getAllItems().filter(item => item.classList.contains('is-idle'));
}

function updateIdleItemStatePosition() {
  const draggableItemRect = draggableItem?.getBoundingClientRect() as DOMRect;
  const draggableItemY = draggableItemRect.top;
  console.log(
    draggableItemRect.height,
    draggableItemRect.top + draggableItemRect?.height / 2,
  );
  const ITEM_GAP = 10;

  getIdleItems().forEach(item => {
    const itemRect = item.getBoundingClientRect();
    const itemY = itemRect.top;
    console.log(itemRect.top + itemRect.height / 2);
    if (isItemAbove(item)) {
      if (draggableItemY <= itemY) {
        item.dataset.isToggled = '';
      } else {
        delete item.dataset.isToggled;
      }
    } else {
      if (draggableItemY >= itemY) {
        item.dataset.isToggled = '';
      } else {
        delete item.dataset.isToggled;
      }
    }
  });

  getIdleItems().forEach(item => {
    if (isItemToggled(item)) {
      const direction = isItemAbove(item) ? 1 : -1;
      item.style.transform = `translateY(${
        direction * (draggableItemRect.height + ITEM_GAP)
      }px)`;
    } else {
      item.style.transform = '';
    }
  });
}

function isItemAbove(item: HTMLDivElement) {
  return item.hasAttribute('data-is-above');
}

function isItemToggled(item: HTMLDivElement) {
  return item.hasAttribute('data-is-toggled');
}

function applyNewItemOrder() {
  const reorderedItems = [] as Array<HTMLDivElement | null>;

  getAllItems().forEach((item, index) => {
    if (item === draggableItem) {
      return;
    }
    if (!isItemToggled(item)) {
      reorderedItems[index] = item;
      return;
    }
    const newIndex = isItemAbove(item) ? index + 1 : index - 1;
    reorderedItems[newIndex] = item;
  });

  for (let i = 0; i < getAllItems().length; i++) {
    if (typeof reorderedItems[i] === 'undefined') {
      reorderedItems[i] = draggableItem;
    }
  }

  reorderedItems.forEach(item => {
    listContainer?.appendChild(item as HTMLDivElement);
  });
}

function unsetItemState() {
  getIdleItems().forEach(item => {
    delete item.dataset.isAbove;
    delete item.dataset.isToggled;
    item.style.transform = '';
  });
}
