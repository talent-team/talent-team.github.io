window.mainModule = window.mainModule || {
    init: function () {
        this.menu.initTop();
        this.menu.initBottom();
        this.viewport.init();
        this.wrapper.init();
        this.initEvents();

        if (window.mContext) {
            if (window.mContext.projectName) {
                $('q.q-project-name').html(Base64.decode(window.mContext.projectName)).removeClass('q-project-name');
                $('title').html(Base64.decode(window.mContext.projectName));
            } else {
                $('q.q-project-name').html('');
            }

            if (window.mContext.projectLink) {
                $('a.a-project-link').attr('href', 'http://' + Base64.decode(window.mContext.projectLink))
                                     .html(Base64.decode(window.mContext.projectLink))
                                     .removeClass('a-project-link')
            } else {
                $('a.a-project-link').hide();
            }
        } else {
            $('q.q-project-name').each(function () {
                var name = $(this).data('pname');
                if (name) {
                    $(this).html(Base64.decode(name)).removeClass('q-project-name');
                } else {
                    $(this).html('');
                }
            });
        }

        $('a[data-enc-href]').each(function () {
            var href = $(this).data('enc-href');
            if (href) {
                href = Base64.decode(href);
                $(this).attr('href', href)
                       .removeAttr('data-enc-href')
                       .data('enc-href', null);
            }
        });
    },
    initEvents: function () {
        var that = this;

        $(document).on('click', 'a[href*="#"]:not([href="#"])', function (e) {
            that.viewport.scrollToElement(this, e, $(this).hasClass('arrows'));
        })
        .on('focusin', '.input', function (e) {
            that.viewport.isInFocus = true;
            $(window).trigger('scroll');
        })
        .on('focusout', '.input', function (e) {
            that.viewport.isInFocus = false;
            $(window).trigger('scroll');
        });
		
		$('#email-form').validate({
			rules: {
				name: {
					required: true
				},
				email: {
					required: true,
					email: true,
				}
			},
			messages: {
				email: {
					email: 'Please check your email format.'
				}
			},
			submitHandler: function (form) {
				$.ajax({
					url: "https://formspree.io/ewg--777+formttt@ya.ru",
					method: "POST",
					data: {
						name: $('#name').val(),
						email: $('#email').val(),
						message: $('#field').val(),
					},
					dataType: "json",
					success: function () {
						alert("Thank you! We'll be in touch shortly.");
						console.log('contactus received');
						window.location.reload();
					},
					error: function () {
						alert("Oops! Something went wrong while submitting the form. Please try later.");
					}
				});
			}
		});
    },
    load: function () {
        this.wrapper.showWithDelay(1000);
        this.viewport.scrollToHashTag();
        this.map.load();
    },

    wrapper: {
        showTimeout: null,
        init: function () {
            this.preventInfHidden(2000);
        },
        showWithDelay: function (delay) {
            var diff = window._startTicks ? (new Date().getTime() - window._startTicks) : -1;
            if (diff >= 0 && diff < delay) {
                if (this.showTimeout) clearTimeout(this.showTimeout);
                this.showTimeout = setTimeout(this.showSite, delay - diff);
            } else {
                this.showSite();
            }
        },
        showSite: function () {
            $('.all-wrapper').css('opacity', '1');
            $('#css-preloader').hide();
        },
        hideSite: function () {
            $('.all-wrapper').hide();
            $('#css-preloader').show();
        },
        preventInfHidden: function (delay) {
            this.showWithDelay(delay);
        }
    },

    menu: {
        initTop: function () {
            $('.menu-button, .w-nav-overlay, .nav-menu .nav-link').on('click', function () {
                if ($('.menu-button').is(':visible')) {
                    var header = $(this).parents('.header').first();
                    if (header.find('.nav-menu.w-nav-menu').hasClass('w--nav-menu-open')) {
                        setTimeout(function () {
                            header.find('.nav-menu.w-nav-menu').removeClass('w--nav-menu-open');
                            header.find('.nav-link.w-nav-link').removeClass('w--nav-link-open');
                        }, 500);

                        header.find('.nav-menu.w-nav-menu').removeClass('nav-menu-tr');
                        header.find('.menu-button.w-nav-button').removeClass('nav-menu-tr');
                        header.find('.w-nav-overlay').hide().css('height', '0');
                    } else {
                        header.find('.nav-menu.w-nav-menu').addClass('w--nav-menu-open');
                        header.find('.nav-link.w-nav-link').addClass('w--nav-link-open');
                        header.find('.nav-menu.w-nav-menu').addClass('nav-menu-tr');
                        header.find('.menu-button.w-nav-button').addClass('nav-menu-tr');
                        header.find('.w-nav-overlay').show().css('height', window.innerHeight + 'px');
                    }
                }
            });
        },
        initBottom: function () {
            var projects = [
                {
                    name: 'TW9qbw==',
                    link: '/project-e-comm.html'
                },
                {
                    name: 'VHJvb2RhdA==',
                    link: '/project-rev-gen.html'
                },
                {
                    name: 'Q2VudHVyeSBDbHVi',
                    link: '/project-club.html'
                },
                {
                    name: 'Q2FyZERyb2lk',
                    link: '/project-car.html'
                },
                {
                    name: 'RS1jb21tZXJjZSBBcHA=',
                    link: '/project-goods.html'
                }
            ];

            $(projects).each(function () {
                var element = $('.footer-projects .footer-cat-header');
                if ($('.footer-projects .footer-link').length) {
                    element = $('.footer-projects .footer-link').last();
                }
                element.after(
                    '<div class="footer-link"><a href="' + this.link + '">' + Base64.decode(this.name) + '</a></div>'
                    );
            });

            if ($('.hero.home').length && document.referrer && document.referrer.indexOf('upwork') >= 0) {
                $('h1.main-heading').after('<h2 class="main-heading sub-heading">100% Client satisfaction with Money back guarantee.</h2>')
            }
        }
    },

    viewport: {
        timeout: null,
        scrollTimeout: null,
        headerTimeout: null,
        isAutoScroll: false,
        isInFocus: false,
        init: function () {
            this.setViewportType();
			//this.loadStyles();
            $(window).trigger('resize');
        },
        resize: function () {
            this.setViewportType();
        },
        scroll: function () {
            var that = this;

            if (that.timeout) clearTimeout(that.timeout);
            if (that.isAutoScroll) {
                that.markAsSeen();
                that.setHeaderState();
                that.setMenuState();
            } else {
                that.timeout = setTimeout(function () {
                    that.markAsSeen();
                    that.setHeaderState();
                    that.setMenuState();
                }, 100);
            }


        },
        scrollToHashTag: function () {
            var that = this;

            that.scrollTimeout = setTimeout(function () {
                var hash = window.location.hash;
                if (hash !== '#' || hash !== '') {
                    var linkForScroll = $('a[href$="' + hash + '"]');
                    if (linkForScroll.length > 0) {
                        that.scrollToElement(linkForScroll[0], null, true, true);
                    }
                }
                clearTimeout(that.scrollTimeout);
            }, 1500);
        },
        scrollToElement: function (element, event, isOverrideAutoscroll, isScrollFast) {
            var that = this;

            if (location.pathname.replace(/^\//, '') == element.pathname.replace(/^\//, '') && location.hostname == element.hostname) {
                var target = $(element.hash);
                target = target.length ? target : $('[name=' + element.hash.slice(1) + ']');
                if (target.length) {
                    var offset = target.offset().top - that.getFixedHeaderCorrection();
                    that.isAutoScroll = !isOverrideAutoscroll;

                    if (isScrollFast) {
                        $('html,body').scrollTop(offset);
                        that.isAutoScroll = false;
                    } else {
                        $('html,body').animate({
                            scrollTop: offset
                        }, 1000).promise().done(function () {
                            that.isAutoScroll = false;
                        });
                    }

                    if (event) event.preventDefault();
                }
            }
        },
        markAsSeen: function () {
            var that = this;

            $('.unseen').each(function () {
                if (that.isInViewport(this)) {
                    $(this).removeClass('unseen').addClass('seen');
                }
            });
        },
        setHeaderState: function () {
            var that = this;
            if (!that.isInFocus && !that.isInViewport($('.hero'))) {
                if ($('.header.fixed').hasClass('hidden')) $('.header.fixed').removeClass('hidden');
            } else {
                if (!$('.header.fixed').hasClass('hidden')) {
                    $('.header.fixed').addClass('disappear');

                    clearTimeout(that.headerTimeout);
                    that.headerTimeout = setTimeout(function () {
                        $('.header.fixed').removeClass('disappear').addClass('hidden');
                    }, 300);

                }
            }
        },
        setViewportType: function () {
            if (window.innerWidth < 991 && window.innerWidth >= 768) {
                $('.all-wrapper').removeClass('mobile-view').addClass('tablet-view');
            } else if (window.innerWidth < 768) {
                $('.all-wrapper').removeClass('tablet-view').addClass('mobile-view');
            } else {
                $('.all-wrapper').removeClass('mobile-view').removeClass('tablet-view');
            }
        },
        setMenuState: function () {
            var that = this;

            var isAnyInViewPort = false;
            $('[data-href]').each(function () {
                if (that.isInViewport($(this)) && !$(this).hasClass('w--current')) {
                    $('.w--current').removeClass('w--current');
                    var href = $(this).data('href');
                    $('[href="' + href + '"]').addClass('w--current');
                    isAnyInViewPort = true;
                }
            });

            if (!isAnyInViewPort) {
                $('.w--current').removeClass('w--current');
            }
        },
        isInViewport: function (element) {
            var $elem = $(element);

            // Get the scroll position of the page.
            var scrollElem = 'html';//((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');
            var viewportTop = $(scrollElem).scrollTop() + this.getFixedHeaderCorrection();
            var viewportBottom = viewportTop + $(window).height() - this.getFixedHeaderCorrection();

            // Get the position of the element on the page.
            var elemTop = Math.round($elem.offset().top);
            var elemBottom = elemTop + $elem.height();

            return ((elemTop < viewportBottom) && (elemBottom > viewportTop));
        },
        getFixedHeaderCorrection: function () {
            return $('.header.fixed').hasClass('hidden') ? 0 : $('.header.fixed').outerHeight();
        },
		loadStyles: function () {
			$('head').append('<link href="style/main.css" rel="stylesheet" type="text/css">');
		}
    },

    map: {
        style: [
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#454545"
                        }
                    ]
                },
                {
                    "featureType": "administrative.country",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "saturation": "18"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#f4f4f4"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 45
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        },
                        {
                            "color": "#ffffff"
                        },
                        {
                            "weight": "0.78"
                        }
                    ]
                }
        ],

        load: function () {
            var that = this;

            if (typeof jQuery != 'undefined') {
                if (typeof GMaps == 'undefined') {
                    jQuery.getScript("https://maps.google.com/maps/api/js?key=AIzaSyA8Qx2-BAUGqHopsjbyfLVENJ_Zlwm3GM8", function () {
                        console.log('Google maps API loaded.');
                        jQuery.getScript("/js/gmaps.js", function () {
                            console.log('Gmaps script loaded.');
                            that.geocode();
                        });
                    });
                } else {
                    that.geocode();
                }
            }
        },

        geocode: function (address) {
            var that = this;
            address = address || $('#address').val();

            if (typeof GMaps != 'undefined' && address) {
                GMaps.geocode({
                    address: address,
                    callback: function (results, status) {
                        if (status == 'OK') {
                            $('#contact-map').addClass('location-loaded');

                            var latlng = results[0].geometry.location;
                            var map = new GMaps({
                                div: '#contact-map',
                                lat: latlng.lat(),
                                lng: latlng.lng(),
                                streetViewControl: false,
                                zoom: 9,
                            });
                            map.addMarker({
                                lat: latlng.lat(),
                                lng: latlng.lng(),
                                //icon: "/i/pin3.svg",
                            });

                            map.addStyle({
                                styledMapName: "Styled Map",
                                styles: that.style,
                                mapTypeId: "map_style"
                            });

                            map.setStyle("map_style");
                        }
                    }
                });
            }
        }
    },
};

$(function () {
    window.mainModule.init();
});

window.onload = function () {
    window.mainModule.load();
};

window.onscroll = function () {
    window.mainModule.viewport.scroll();
}

window.onresize = function () {
    window.mainModule.viewport.resize();
}

var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
