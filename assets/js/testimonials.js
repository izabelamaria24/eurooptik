// File: assets/js/testimonials.js

jQuery(function($) {
  // This is a best-practice way to wrap jQuery code.
  // It ensures that the code runs after the document is ready and
  // that `$` is a safe alias for jQuery.

  // Define the selector for our triggers
  var triggerSelector = '.testimonial-trigger';

  // Check if any testimonial triggers exist on the page before running code
  if ($(triggerSelector).length > 0) {

    // Handle clicks on the testimonial image triggers
    $(document).on('click', triggerSelector, function(e) {
      // Prevent the link's default behavior (jumping to the top of the page)
      e.preventDefault();

      var $this = $(this); // The specific trigger that was clicked

      // If this one is already active, do nothing to prevent unnecessary animations
      if ($this.hasClass('active')) {
        return;
      }

      // Get the target ID from the data-target attribute
      var targetId = $this.data('target');

      // --- Update Active State for Images ---
      // 1. Remove 'active' class from all triggers
      $(triggerSelector).removeClass('active');
      // 2. Add 'active' class to the one that was clicked
      $this.addClass('active');

      // --- Update Active State for Text Content ---
      var contentWrapper = $('#testimonial-content-wrapper');
      var activeContent = contentWrapper.find('.testimonial-content.active');
      var newContent = contentWrapper.find('.testimonial-content[data-testimonial="' + targetId + '"]');

      // 1. Fade out the currently active text
      if (activeContent.length > 0) {
        activeContent.stop(true, true).fadeOut(200, function() {
          $(this).removeClass('active');
          // 2. Fade in the new text after the old one is gone
          newContent.stop(true, true).fadeIn(300).addClass('active');
        });
      } else {
        // If no content was active (like on page load), just fade in the new one
        newContent.stop(true, true).fadeIn(300).addClass('active');
      }
    });
  }
});