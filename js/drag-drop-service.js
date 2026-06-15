/**
 * DragDropService Module — Drag-and-drop and arrow button reordering
 *
 * Provides HTML5 drag-and-drop for desktop and arrow buttons for mobile.
 * Supports both menu item reordering and category reordering.
 *
 * Architecture: IIFE module, exposes window.DragDropService
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  var draggedItem = null;
  var draggedCategory = null;
  var placeholder = null;
  var onReorderCallback = null;
  var onCategoryReorderCallback = null;

  // ---------------------------------------------------------------------------
  // Helper functions
  // ---------------------------------------------------------------------------

  /**
   * Check if device is mobile based on screen width.
   * @returns {boolean} True if mobile
   */
  function isMobile() {
    return window.innerWidth <= 768;
  }

  /**
   * Create a placeholder element for drag feedback.
   * @returns {HTMLElement} Placeholder element
   */
  function createPlaceholder() {
    var el = document.createElement('div');
    el.className = 'drag-placeholder';
    el.style.height = '4px';
    el.style.backgroundColor = 'var(--color-primary)';
    el.style.borderRadius = '2px';
    el.style.margin = '4px 0';
    el.style.transition = 'all 0.2s ease';
    return el;
  }

  /**
   * Get the index of an element in its parent.
   * @param {HTMLElement} el - Element
   * @returns {number} Index
   */
  function getElementIndex(el) {
    var index = 0;
    var sibling = el.previousElementSibling;
    while (sibling) {
      if (sibling.classList.contains('menu__item-card') || 
          sibling.classList.contains('admin-stock__card')) {
        index++;
      }
      sibling = sibling.previousElementSibling;
    }
    return index;
  }

  // ---------------------------------------------------------------------------
  // Drag and Drop for Menu Items
  // ---------------------------------------------------------------------------

  /**
   * Initialize drag-and-drop for menu items.
   * @param {HTMLElement} container - Container element with menu items
   * @param {Function} onReorder - Callback when order changes
   */
  function initDragDrop(container, onReorder) {
    onReorderCallback = onReorder;

    var items = container.querySelectorAll('.menu__item-card, .admin-stock__card');
    
    items.forEach(function (item) {
      // Make item draggable
      item.setAttribute('draggable', 'true');
      item.style.cursor = 'grab';

      // Drag start
      item.addEventListener('dragstart', function (e) {
        draggedItem = this;
        this.style.opacity = '0.5';
        this.style.cursor = 'grabbing';
        
        // Create placeholder
        placeholder = createPlaceholder();
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.dataset.itemId || '');
      });

      // Drag end
      item.addEventListener('dragend', function () {
        this.style.opacity = '1';
        this.style.cursor = 'grab';
        
        // Remove placeholder
        if (placeholder && placeholder.parentNode) {
          placeholder.parentNode.removeChild(placeholder);
        }
        
        draggedItem = null;
        placeholder = null;
      });

      // Drag over
      item.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        if (draggedItem && this !== draggedItem) {
          var rect = this.getBoundingClientRect();
          var midY = rect.top + rect.height / 2;
          
          // Insert placeholder
          if (e.clientY < midY) {
            this.parentNode.insertBefore(placeholder, this);
          } else {
            this.parentNode.insertBefore(placeholder, this.nextSibling);
          }
        }
      });

      // Drop
      item.addEventListener('drop', function (e) {
        e.preventDefault();
        
        if (draggedItem && this !== draggedItem) {
          var rect = this.getBoundingClientRect();
          var midY = rect.top + rect.height / 2;
          
          // Insert dragged item
          if (e.clientY < midY) {
            this.parentNode.insertBefore(draggedItem, this);
          } else {
            this.parentNode.insertBefore(draggedItem, this.nextSibling);
          }
          
          // Get new order
          var newOrder = getItemsOrder(container);
          
          // Callback
          if (onReorderCallback) {
            onReorderCallback(newOrder);
          }
        }
      });
    });
  }

  /**
   * Initialize arrow buttons for menu items.
   * @param {HTMLElement} container - Container element with menu items
   * @param {Function} onReorder - Callback when order changes
   */
  function initArrowButtons(container, onReorder) {
    onReorderCallback = onReorder;

    var items = container.querySelectorAll('.menu__item-card, .admin-stock__card');
    
    items.forEach(function (item, index) {
      // Create arrow buttons container
      var arrowsContainer = document.createElement('div');
      arrowsContainer.className = 'item-arrows';
      arrowsContainer.style.display = 'flex';
      arrowsContainer.style.flexDirection = 'column';
      arrowsContainer.style.gap = '4px';
      arrowsContainer.style.marginLeft = 'auto';

      // Up button
      var upBtn = document.createElement('button');
      upBtn.className = 'arrow-btn arrow-btn--up';
      upBtn.innerHTML = '▲';
      upBtn.title = 'Pindah ke atas';
      upBtn.style.cssText = 'background:var(--color-primary);color:white;border:none;border-radius:4px;padding:4px 8px;cursor:pointer;font-size:10px;';
      upBtn.disabled = index === 0;
      upBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        moveItemUp(item, container);
      });

      // Down button
      var downBtn = document.createElement('button');
      downBtn.className = 'arrow-btn arrow-btn--down';
      downBtn.innerHTML = '▼';
      downBtn.title = 'Pindah ke bawah';
      downBtn.style.cssText = 'background:var(--color-primary);color:white;border:none;border-radius:4px;padding:4px 8px;cursor:pointer;font-size:10px;';
      downBtn.disabled = index === items.length - 1;
      downBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        moveItemDown(item, container);
      });

      arrowsContainer.appendChild(upBtn);
      arrowsContainer.appendChild(downBtn);

      // Add to item
      item.appendChild(arrowsContainer);
    });
  }

  /**
   * Move item up in the list.
   * @param {HTMLElement} item - Item to move
   * @param {HTMLElement} container - Container element
   */
  function moveItemUp(item, container) {
    var prevSibling = item.previousElementSibling;
    
    if (prevSibling && (prevSibling.classList.contains('menu__item-card') || 
        prevSibling.classList.contains('admin-stock__card'))) {
      container.insertBefore(item, prevSibling);
      updateArrowButtons(container);
      
      var newOrder = getItemsOrder(container);
      if (onReorderCallback) {
        onReorderCallback(newOrder);
      }
    }
  }

  /**
   * Move item down in the list.
   * @param {HTMLElement} item - Item to move
   * @param {HTMLElement} container - Container element
   */
  function moveItemDown(item, container) {
    var nextSibling = item.nextElementSibling;
    
    if (nextSibling && (nextSibling.classList.contains('menu__item-card') || 
        nextSibling.classList.contains('admin-stock__card'))) {
      container.insertBefore(nextSibling, item);
      updateArrowButtons(container);
      
      var newOrder = getItemsOrder(container);
      if (onReorderCallback) {
        onReorderCallback(newOrder);
      }
    }
  }

  /**
   * Update arrow button states after reordering.
   * @param {HTMLElement} container - Container element
   */
  function updateArrowButtons(container) {
    var items = container.querySelectorAll('.menu__item-card, .admin-stock__card');
    
    items.forEach(function (item, index) {
      var upBtn = item.querySelector('.arrow-btn--up');
      var downBtn = item.querySelector('.arrow-btn--down');
      
      if (upBtn) upBtn.disabled = index === 0;
      if (downBtn) downBtn.disabled = index === items.length - 1;
    });
  }

  /**
   * Get the order of items in a container.
   * @param {HTMLElement} container - Container element
   * @returns {Array} Array of item IDs in order
   */
  function getItemsOrder(container) {
    var items = container.querySelectorAll('.menu__item-card, .admin-stock__card');
    var order = [];
    
    items.forEach(function (item) {
      order.push(item.dataset.itemId);
    });
    
    return order;
  }

  // ---------------------------------------------------------------------------
  // Category Reordering
  // ---------------------------------------------------------------------------

  /**
   * Initialize category reordering.
   * @param {HTMLElement} container - Container with category sections
   * @param {Function} onReorder - Callback when category order changes
   */
  function initCategoryReorder(container, onReorder) {
    onCategoryReorderCallback = onReorder;

    var categories = container.querySelectorAll('.menu__category, .admin-stock__category');
    
    categories.forEach(function (category) {
      var header = category.querySelector('.menu__category-title, .admin-stock__category-title');
      
      if (header) {
        header.style.cursor = 'grab';
        header.setAttribute('draggable', 'true');

        // Drag start
        header.addEventListener('dragstart', function (e) {
          draggedCategory = category;
          category.style.opacity = '0.5';
          e.dataTransfer.effectAllowed = 'move';
        });

        // Drag end
        header.addEventListener('dragend', function () {
          category.style.opacity = '1';
          draggedCategory = null;
        });

        // Drag over
        category.addEventListener('dragover', function (e) {
          e.preventDefault();
          
          if (draggedCategory && this !== draggedCategory) {
            var rect = this.getBoundingClientRect();
            var midY = rect.top + rect.height / 2;
            
            if (e.clientY < midY) {
              this.parentNode.insertBefore(draggedCategory, this);
            } else {
              this.parentNode.insertBefore(draggedCategory, this.nextSibling);
            }
          }
        });

        // Drop
        category.addEventListener('drop', function (e) {
          e.preventDefault();
          
          if (draggedCategory && this !== draggedCategory) {
            var newOrder = getCategoryOrder(container);
            
            if (onCategoryReorderCallback) {
              onCategoryReorderCallback(newOrder);
            }
          }
        });
      }
    });
  }

  /**
   * Get the order of categories in a container.
   * @param {HTMLElement} container - Container element
   * @returns {Array} Array of category names in order
   */
  function getCategoryOrder(container) {
    var categories = container.querySelectorAll('.menu__category, .admin-stock__category');
    var order = [];
    
    categories.forEach(function (category) {
      var title = category.querySelector('.menu__category-title, .admin-stock__category-title');
      if (title) {
        order.push(title.textContent.trim());
      }
    });
    
    return order;
  }

  // ---------------------------------------------------------------------------
  // Expose public API via global namespace
  // ---------------------------------------------------------------------------
  window.DragDropService = {
    initDragDrop:           initDragDrop,
    initArrowButtons:       initArrowButtons,
    initCategoryReorder:    initCategoryReorder,
    getItemsOrder:          getItemsOrder,
    getCategoryOrder:       getCategoryOrder,
    isMobile:               isMobile
  };

})();
