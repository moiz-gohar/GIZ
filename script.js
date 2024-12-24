$(document).ready(function () {
    var navbar = $("#navbar");
    var mobileMenu = $(".mobile-menu");
    var mobileMenuToggle = $(".mobile-menu-toggle");
    var closeMenuButton = $(".close-menu");
    var isMenuOpen = false;

    // Timeline for navbar animations
    var scrollTimeline = gsap.timeline({ paused: true });

    // Define the animations for expanding and shrinking the navbar
    scrollTimeline
        .to(navbar, {
            duration: 0.5,
            width: "100%",
            maxWidth: "100%",
            top: 0,
            borderRadius: "var(--navbar-scroll-radius)",
            ease: "power4.out",
        })
        .reverse(); // Start timeline reversed for the initial "shrunk" state

    // Initial animation for navbar
    gsap.from(navbar, { duration: 1, y: -100, opacity: 0 });

    // Scroll event for navbar
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();

        // Reverse the timeline based on scroll position
        if (scroll >= 50) {
            scrollTimeline.play(); // Expand the navbar
        } else {
            scrollTimeline.reverse(); // Shrink the navbar
        }
    });

    // Toggle mobile menu visibility
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            gsap.to(mobileMenu, { duration: 0.5, right: "0" });
            mobileMenuToggle.addClass("active"); // Hamburger to X animation
        } else {
            gsap.to(mobileMenu, { duration: 0.5, right: "-100%" });
            mobileMenuToggle.removeClass("active"); // Reset to hamburger
        }
    }

    // Hamburger menu toggle click event
    mobileMenuToggle.click(function () {
        toggleMobileMenu();
    });

    // Close button for mobile menu
    closeMenuButton.click(function () {
        toggleMobileMenu();
    });

    // Close mobile menu when clicking a link
    mobileMenu.find("a").click(function () {
        gsap.to(mobileMenu, { duration: 0.5, right: "-100%" });
    });

    // Responsive behavior
    function checkWidth() {
        var windowWidth = $(window).width();
        if (windowWidth <= 768) {
            navbar.addClass("mobile");
        } else {
            navbar.removeClass("mobile");
            gsap.to(mobileMenu, { duration: 0.5, right: "-100%", ease: "power2.out" });
        }
    }

    // Check width on page load and window resize
    checkWidth();
    $(window).resize(checkWidth);
});


$(document).ready(function () {
    const $slides = $('.slide');
    const $indicators = $('.indicators');
    const $progress = $('.progress');
    let currentSlide = 0;
    let interval;
    let progressTween;
    let isPaused = false; // To track play/pause state
    let touchStarted = false; // To distinguish between touch and click events

    // Create indicators
    $slides.each((index) => {
        $indicators.append(`<div class="indicator${index === 0 ? ' active' : ''}" data-index="${index}"></div>`);
    });

    function goToSlide(index) {
        if (index === currentSlide) return; // Prevent redundant actions if the same slide is selected

        // Stop any ongoing progress animation
        clearInterval(interval);
        if (progressTween) progressTween.kill();

        // Reset progress bar instantly
        gsap.set($progress, { width: '0%' });

        // Transition slides
        gsap.to($slides.eq(currentSlide), { opacity: 0, duration: 0.5 });
        gsap.to($slides.eq(index), { opacity: 1, duration: 0.5 });

        // Update indicators
        $('.indicator').removeClass('active');
        $('.indicator').eq(index).addClass('active');

        // Update current slide index
        currentSlide = index;

        // Restart progress bar animation and timer
        startProgress();
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % $slides.length);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + $slides.length) % $slides.length);
    }

    function startProgress() {
        // Clear any existing interval and kill any ongoing tween
        clearInterval(interval);
        if (progressTween) progressTween.kill();

        // Reset progress bar width
        gsap.set($progress, { width: '0%' });

        // Animate progress bar to 100% over 5 seconds
        progressTween = gsap.to($progress, { width: '100%', duration: 10, ease: 'none' });

        // Start the auto-slide interval
        interval = setInterval(nextSlide, 10000);
    }

    function pauseSlideshow() {
        clearInterval(interval); // Stop the interval
        if (progressTween) progressTween.pause(); // Pause the progress animation
        isPaused = true; // Update the state
    }

    function resumeSlideshow() {
        if (!isPaused) return; // Only resume if it was paused
        if (progressTween && !progressTween.isActive()) {
            progressTween.resume(); // Resume the progress animation
            // Calculate remaining time and set the interval accordingly
            const remainingTime = (1 - progressTween.progress()) * 5000;
            interval = setTimeout(nextSlide, remainingTime);
        } else {
            startProgress(); // Restart progress if no active tween
        }
        isPaused = false; // Update the state
    }

    // Touch and click events to pause and resume slideshow
    $('.slide-container').on('touchstart', function () {
        touchStarted = true; // Mark touch interaction
        if (isPaused) {
            resumeSlideshow();
        } else {
            pauseSlideshow();
        }
    });

    $('.slide-container').on('click', function () {
        if (touchStarted) {
            touchStarted = false; // Reset the flag to avoid duplicate handling
            return; // Ignore the click event triggered after touchstart
        }
        if (isPaused) {
            resumeSlideshow();
        } else {
            pauseSlideshow();
        }
    });

    // Event listeners for navigation buttons
    $('.next-button').on('click', () => {
        nextSlide();
    });

    $('.prev-button').on('click', () => {
        prevSlide();
    });

    // Event listener for indicators
    $('.indicator').on('click', function () {
        const index = $(this).data('index');
        goToSlide(index);
    });

    // Initial start of the slideshow
    startProgress();
});


$(document).ready(function () {
    function matchHeight() {
        var aboutUsImage = $(".about-us-image img");
        var aboutUsText = $(".about-us-text");

        if (aboutUsImage.length && aboutUsText.length) {
            var textHeight = aboutUsText.outerHeight();
            aboutUsImage.css("height", textHeight);
        }
    }

    // Match height on page load
    matchHeight();

    // Match height on window resize
    $(window).resize(function () {
        matchHeight();
    });
});


$(document).ready(function () {
    gsap.registerPlugin(ScrollTrigger);

    const aboutUs = $("#about-us");
    if (!aboutUs.length) {
        console.error("Element #about-us not found.");
        return;
    }

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: aboutUs,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            // onEnter: () => console.log("ScrollTrigger Entered"),
            // markers: true // Enable markers for debugging
        }
    });

    tl.from(".about-us-image", {
        x: -100,
        opacity: 0,
        duration: 1
    })
        .from(".about-us-text h2", {
            y: 50,
            opacity: 0,
            duration: 0.8
        }, "-=0.5")
        .from(".about-us-text p", {
            y: 50,
            opacity: 0,
            duration: 0.8
        }, "-=0.5")
        .from(".social-icons", {
            y: 50,
            opacity: 0,
            duration: 0.8
        }, "-=0.5")
        .from(".sponsors", {
            y: 50,
            opacity: 0,
            duration: 0.8
        }, "-=0.5");
});



$(document).ready(function () {
    gsap.registerPlugin(ScrollTrigger);

    const prioritySectors = $("#priority-sectors");
    if (!prioritySectors.length) {
        console.error("Element #priority-sectors not found.");
        return;
    }

    const tl2 = gsap.timeline({
        scrollTrigger: {
            trigger: prioritySectors,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            // onEnter: () => console.log("ScrollTrigger Entered"),
            // markers: true // Enable markers for debugging
        }
    });

    tl2.from(".priority-sectors h2", {
        y: 50,
        opacity: 0,
        duration: 1
    })
        .from(".priority-sectors p", {
            y: 50,
            opacity: 0,
            duration: 0.8
        }, "-=0.5")
        .from(".sector-card", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.3
        }, "-=0.5");
});


$(document).ready(function () {
    // GSAP and ScrollTrigger Setup
    gsap.registerPlugin(ScrollTrigger);

    // Animate the #timeline section as it comes into view
    gsap.fromTo(
        "#timeline",
        {
            opacity: 0, // Start with the section hidden
            y: 50, // Slightly move it down
        },
        {
            opacity: 1, // Fade in
            y: 0, // Move to the original position
            duration: 1, // Animation duration
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#timeline",
                start: "top 80%", // When the top of #timeline hits 80% of the viewport
                end: "bottom 20%", // When the bottom of #timeline hits 20% of the viewport
                toggleActions: "play none none reverse", // Play animation when entering, reverse when leaving
            },
        }
    );

    // Optional: Add a subtle parallax effect for the entire #timeline
    gsap.to("#timeline", {
        yPercent: -10, // Slight upward motion
        ease: "none",
        scrollTrigger: {
            trigger: "#timeline",
            start: "top bottom", // Start when #timeline enters the viewport
            end: "bottom top", // End when it leaves the viewport
            scrub: true, // Smoothly follow the scroll
        },
    });
});

$(document).ready(function ($) {


    
    var timelines = $('.cd-horizontal-timeline'),
        eventsMinDistance = 60;

    (timelines.length > 0) && initTimeline(timelines);

    function initTimeline(timelines) {
        timelines.each(function () {
            var timeline = $(this),
                timelineComponents = {};
            //cache timeline components 
            timelineComponents['timelineWrapper'] = timeline.find('.events-wrapper');
            timelineComponents['eventsWrapper'] = timelineComponents['timelineWrapper'].children('.events');
            timelineComponents['fillingLine'] = timelineComponents['eventsWrapper'].children('.filling-line');
            timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].find('a');
            timelineComponents['timelineDates'] = parseDate(timelineComponents['timelineEvents']);
            timelineComponents['eventsMinLapse'] = minLapse(timelineComponents['timelineDates']);
            timelineComponents['timelineNavigation'] = timeline.find('.cd-timeline-navigation');
            timelineComponents['eventsContent'] = timeline.children('.events-content');

            //assign a left postion to the single events along the timeline
            setDatePosition(timelineComponents, eventsMinDistance);
            //assign a width to the timeline
            var timelineTotWidth = setTimelineWidth(timelineComponents, eventsMinDistance);
            //the timeline has been initialize - show it
            timeline.addClass('loaded');

            //detect click on the next arrow
            timelineComponents['timelineNavigation'].on('click', '.next', function (event) {
                event.preventDefault();
                updateSlide(timelineComponents, timelineTotWidth, 'next');
            });
            //detect click on the prev arrow
            timelineComponents['timelineNavigation'].on('click', '.prev', function (event) {
                event.preventDefault();
                updateSlide(timelineComponents, timelineTotWidth, 'prev');
            });
            //detect click on the a single event - show new event content
            timelineComponents['eventsWrapper'].on('click', 'a', function (event) {
                event.preventDefault();
                timelineComponents['timelineEvents'].removeClass('selected');
                $(this).addClass('selected');
                updateOlderEvents($(this));
                updateFilling($(this), timelineComponents['fillingLine'], timelineTotWidth);
                updateVisibleContent($(this), timelineComponents['eventsContent']);
            });

            //on swipe, show next/prev event content
            timelineComponents['eventsContent'].on('swipeleft', function () {
                var mq = checkMQ();
                (mq == 'mobile') && showNewContent(timelineComponents, timelineTotWidth, 'next');
            });
            timelineComponents['eventsContent'].on('swiperight', function () {
                var mq = checkMQ();
                (mq == 'mobile') && showNewContent(timelineComponents, timelineTotWidth, 'prev');
            });

            //keyboard navigation
            $(document).keyup(function (event) {
                if (event.which == '37' && elementInViewport(timeline.get(0))) {
                    showNewContent(timelineComponents, timelineTotWidth, 'prev');
                } else if (event.which == '39' && elementInViewport(timeline.get(0))) {
                    showNewContent(timelineComponents, timelineTotWidth, 'next');
                }
            });
        });
    }

    function updateSlide(timelineComponents, timelineTotWidth, string) {
        //retrieve translateX value of timelineComponents['eventsWrapper']
        var translateValue = getTranslateValue(timelineComponents['eventsWrapper']),
            wrapperWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', ''));
        //translate the timeline to the left('next')/right('prev') 
        (string == 'next')
            ? translateTimeline(timelineComponents, translateValue - wrapperWidth + eventsMinDistance, wrapperWidth - timelineTotWidth)
            : translateTimeline(timelineComponents, translateValue + wrapperWidth - eventsMinDistance);
    }

    function showNewContent(timelineComponents, timelineTotWidth, string) {
        //go from one event to the next/previous one
        var visibleContent = timelineComponents['eventsContent'].find('.selected'),
            newContent = (string == 'next') ? visibleContent.next() : visibleContent.prev();

        if (newContent.length > 0) { //if there's a next/prev event - show it
            var selectedDate = timelineComponents['eventsWrapper'].find('.selected'),
                newEvent = (string == 'next') ? selectedDate.parent('li').next('li').children('a') : selectedDate.parent('li').prev('li').children('a');

            updateFilling(newEvent, timelineComponents['fillingLine'], timelineTotWidth);
            updateVisibleContent(newEvent, timelineComponents['eventsContent']);
            newEvent.addClass('selected');
            selectedDate.removeClass('selected');
            updateOlderEvents(newEvent);
            updateTimelinePosition(string, newEvent, timelineComponents, timelineTotWidth);
        }
    }

    function updateTimelinePosition(string, event, timelineComponents, timelineTotWidth) {
        //translate timeline to the left/right according to the position of the selected event
        var eventStyle = window.getComputedStyle(event.get(0), null),
            eventLeft = Number(eventStyle.getPropertyValue("left").replace('px', '')),
            timelineWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', '')),
            timelineTotWidth = Number(timelineComponents['eventsWrapper'].css('width').replace('px', ''));
        var timelineTranslate = getTranslateValue(timelineComponents['eventsWrapper']);

        if ((string == 'next' && eventLeft > timelineWidth - timelineTranslate) || (string == 'prev' && eventLeft < - timelineTranslate)) {
            translateTimeline(timelineComponents, - eventLeft + timelineWidth / 2, timelineWidth - timelineTotWidth);
        }
    }

    function translateTimeline(timelineComponents, value, totWidth) {
        var eventsWrapper = timelineComponents['eventsWrapper'].get(0);
        value = (value > 0) ? 0 : value; //only negative translate value
        value = (!(typeof totWidth === 'undefined') && value < totWidth) ? totWidth : value; //do not translate more than timeline width
        setTransformValue(eventsWrapper, 'translateX', value + 'px');
        //update navigation arrows visibility
        (value == 0) ? timelineComponents['timelineNavigation'].find('.prev').addClass('inactive') : timelineComponents['timelineNavigation'].find('.prev').removeClass('inactive');
        (value == totWidth) ? timelineComponents['timelineNavigation'].find('.next').addClass('inactive') : timelineComponents['timelineNavigation'].find('.next').removeClass('inactive');
    }

    function updateFilling(selectedEvent, filling, totWidth) {
        //change .filling-line length according to the selected event
        var eventStyle = window.getComputedStyle(selectedEvent.get(0), null),
            eventLeft = eventStyle.getPropertyValue("left"),
            eventWidth = eventStyle.getPropertyValue("width");
        eventLeft = Number(eventLeft.replace('px', '')) + Number(eventWidth.replace('px', '')) / 2;
        var scaleValue = eventLeft / totWidth;
        setTransformValue(filling.get(0), 'scaleX', scaleValue);
    }

    function setDatePosition(timelineComponents, min) {
        for (i = 0; i < timelineComponents['timelineDates'].length; i++) {
            var distance = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][i]),
                distanceNorm = Math.round(distance / timelineComponents['eventsMinLapse']) + 2;
            timelineComponents['timelineEvents'].eq(i).css('left', distanceNorm * min + 'px');
        }
    }

    function setTimelineWidth(timelineComponents, width) {
        var timeSpan = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][timelineComponents['timelineDates'].length - 1]),
            timeSpanNorm = timeSpan / timelineComponents['eventsMinLapse'],
            timeSpanNorm = Math.round(timeSpanNorm) + 4,
            totalWidth = timeSpanNorm * width;
        timelineComponents['eventsWrapper'].css('width', totalWidth + 'px');
        updateFilling(timelineComponents['timelineEvents'].eq(0), timelineComponents['fillingLine'], totalWidth);

        return totalWidth;
    }

    function updateVisibleContent(event, eventsContent) {
        var eventDate = event.data('date'),
            visibleContent = eventsContent.find('.selected'),
            selectedContent = eventsContent.find('[data-date="' + eventDate + '"]'),
            selectedContentHeight = selectedContent.height();

        if (selectedContent.index() > visibleContent.index()) {
            var classEnetering = 'selected enter-right',
                classLeaving = 'leave-left';
        } else {
            var classEnetering = 'selected enter-left',
                classLeaving = 'leave-right';
        }

        selectedContent.attr('class', classEnetering);
        visibleContent.attr('class', classLeaving).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
            visibleContent.removeClass('leave-right leave-left');
            selectedContent.removeClass('enter-left enter-right');
        });
        eventsContent.css('height', selectedContentHeight + 'px');
    }

    function updateOlderEvents(event) {
        event.parent('li').prevAll('li').children('a').addClass('older-event').end().end().nextAll('li').children('a').removeClass('older-event');
    }

    function getTranslateValue(timeline) {
        var timelineStyle = window.getComputedStyle(timeline.get(0), null),
            timelineTranslate = timelineStyle.getPropertyValue("-webkit-transform") ||
                timelineStyle.getPropertyValue("-moz-transform") ||
                timelineStyle.getPropertyValue("-ms-transform") ||
                timelineStyle.getPropertyValue("-o-transform") ||
                timelineStyle.getPropertyValue("transform");

        if (timelineTranslate.indexOf('(') >= 0) {
            var timelineTranslate = timelineTranslate.split('(')[1];
            timelineTranslate = timelineTranslate.split(')')[0];
            timelineTranslate = timelineTranslate.split(',');
            var translateValue = timelineTranslate[4];
        } else {
            var translateValue = 0;
        }

        return Number(translateValue);
    }

    function setTransformValue(element, property, value) {
        element.style["-webkit-transform"] = property + "(" + value + ")";
        element.style["-moz-transform"] = property + "(" + value + ")";
        element.style["-ms-transform"] = property + "(" + value + ")";
        element.style["-o-transform"] = property + "(" + value + ")";
        element.style["transform"] = property + "(" + value + ")";
    }

    //based on http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
    function parseDate(events) {
        var dateArrays = [];
        events.each(function () {
            var dateComp = $(this).data('date').split('/'),
                newDate = new Date(dateComp[2], dateComp[1] - 1, dateComp[0]);
            dateArrays.push(newDate);
        });
        return dateArrays;
    }

    function parseDate2(events) {
        var dateArrays = [];
        events.each(function () {
            var singleDate = $(this),
                dateComp = singleDate.data('date').split('T');
            if (dateComp.length > 1) { //both DD/MM/YEAR and time are provided
                var dayComp = dateComp[0].split('/'),
                    timeComp = dateComp[1].split(':');
            } else if (dateComp[0].indexOf(':') >= 0) { //only time is provide
                var dayComp = ["2000", "0", "0"],
                    timeComp = dateComp[0].split(':');
            } else { //only DD/MM/YEAR
                var dayComp = dateComp[0].split('/'),
                    timeComp = ["0", "0"];
            }
            var newDate = new Date(dayComp[2], dayComp[1] - 1, dayComp[0], timeComp[0], timeComp[1]);
            dateArrays.push(newDate);
        });
        return dateArrays;
    }

    function daydiff(first, second) {
        return Math.round((second - first));
    }

    function minLapse(dates) {
        //determine the minimum distance among events
        var dateDistances = [];
        for (i = 1; i < dates.length; i++) {
            var distance = daydiff(dates[i - 1], dates[i]);
            dateDistances.push(distance);
        }
        return Math.min.apply(null, dateDistances);
    }

    /*
        How to tell if a DOM element is visible in the current viewport?
        http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
    */
    function elementInViewport(el) {
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        return (
            top < (window.pageYOffset + window.innerHeight) &&
            left < (window.pageXOffset + window.innerWidth) &&
            (top + height) > window.pageYOffset &&
            (left + width) > window.pageXOffset
        );
    }

    function checkMQ() {
        //check if mobile or desktop device
        return window.getComputedStyle(document.querySelector('.cd-horizontal-timeline'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
    }
});















$(document).ready(function () {
    const mainProgressBar = document.querySelector(
        ".progress-bar-primary-unique .progress-bar-fill-unique"
    );
    const mainPosts = document.querySelectorAll(".main-post-unique");
    const posts = document.querySelectorAll(".post-unique");

    let i = 0;
    let postIndex = 0;
    let currentPost = posts[postIndex];
    let currentMainPost = mainPosts[postIndex];

    let progressInterval = setInterval(progress, 100);

    function progress() {
        if (i === 100) {
            i = -5;
            currentPost.querySelector(".progress-bar-fill-unique").style.width = 0;
            mainProgressBar.style.width = 0;
            currentPost.classList.remove("post-active-unique");

            postIndex++;

            currentMainPost.classList.add("main-post-not-active-unique");
            currentMainPost.classList.remove("main-post-active-unique");

            if (postIndex === posts.length) {
                postIndex = 0;
            }

            currentPost = posts[postIndex];
            currentMainPost = mainPosts[postIndex];
        } else {
            i++;
            currentPost.querySelector(".progress-bar-fill-unique").style.width = `${i}%`;
            mainProgressBar.style.width = `${i}%`;
            currentPost.classList.add("post-active-unique");

            currentMainPost.classList.add("main-post-active-unique");
            currentMainPost.classList.remove("main-post-not-active-unique");
        }
    }

    posts.forEach((post, index) => {
        post.addEventListener("click", () => {
            disablePostsTemporarily();
            i = 0;
            postIndex = index;
            updatePosts();
        });
    });

    function disablePostsTemporarily() {
        posts.forEach((post) => {
            post.classList.add("post-disabled-unique");
        });

        setTimeout(() => {
            posts.forEach((post) => {
                post.classList.remove("post-disabled-unique");
            });
        }, 2500);
    }

    function updatePosts() {
        posts.forEach((post) => {
            post.querySelector(".progress-bar-fill-unique").style.width = 0;
            post.classList.remove("post-active-unique");
        });

        mainPosts.forEach((mainPost) => {
            mainPost.classList.add("main-post-not-active-unique");
            mainPost.classList.remove("main-post-active-unique");
        });

        currentPost = posts[postIndex];
        currentMainPost = mainPosts[postIndex];

        currentPost.querySelector(".progress-bar-fill-unique").style.width = `${i}%`;
        mainProgressBar.style.width = `${i}%`;
        currentPost.classList.add("post-active-unique");

        currentMainPost.classList.add("main-post-active-unique");
        currentMainPost.classList.remove("main-post-not-active-unique");
    }


});




$(document).ready(function () {
    gsap.registerPlugin(ScrollTrigger);

    const contactSection = $(".contact-container");
    if (!contactSection.length) {
        console.error("Element .contact-container not found.");
        return;
    }

    const tlContact = gsap.timeline({
        scrollTrigger: {
            trigger: contactSection,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
        }
    });

    tlContact.from(".contact-title", {
        y: 50,
        opacity: 0,
        duration: 1
    })
    .from(".contact-form-group", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3
    }, "-=0.5")
    .from(".contact-map-section", {
        y: 50,
        opacity: 0,
        duration: 1
    }, "-=0.5")
    .from(".contact-btn", {
        y: 50,
        opacity: 0,
        duration: 0.8
    }, "-=0.5")
    .from(".social-icons-contact a", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    }, "-=0.5");
});


$(document).ready(function() {
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        var name = $('#name').val();
        var email = $('#email').val();
        var message = $('#message').val();

        // Here you would typically send this data to your server
        // For this example, we'll just log it to the console
        console.log('Form submitted!');
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Message:', message);

        // Clear the form
        $('#contactForm')[0].reset();

        // Show a success message (you can customize this)
        alert('Thank you for your message. We will get back to you soon!');
    });
});



$(document).ready(function(){
    $('.accordion-list > li > .answer').hide();
      
    $('.accordion-list > li').click(function() {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active").find(".answer").slideUp();
      } else {
        $(".accordion-list > li.active .answer").slideUp();
        $(".accordion-list > li.active").removeClass("active");
        $(this).addClass("active").find(".answer").slideDown();
      }
      return false;
    });
    
  });