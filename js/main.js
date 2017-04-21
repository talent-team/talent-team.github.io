$(function () {
    $('.menu-button, .w-nav-overlay').on('click', function () {
        if ($('.nav-menu.w-nav-menu').hasClass('w--nav-menu-open')) {
            $('.nav-menu.w-nav-menu').removeClass('w--nav-menu-open');
            $('.nav-link.w-nav-link').removeClass('w--nav-link-open');
            $('.w-nav-overlay').hide().css('height', '0');
        } else {
            $('.nav-menu.w-nav-menu').addClass('w--nav-menu-open');
            $('.nav-link.w-nav-link').addClass('w--nav-link-open');
            $('.w-nav-overlay').show().css('height', window.innerHeight + 'px');
        }
        
    });

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

    var projects = [
        {
            name: 'Mojo',
            link: '/project-e-comm.html'
        },
        {
            name: 'Troodat',
            link: '/project-rev-gen.html'
        },
        {
            name: 'Century Club',
            link: '/project-club.html'
        },
        {
            name: 'CardDroid',
            link: '/project-car.html'
        },
        {
            name: 'Удобный Слон',
            link: '/project-goods.html'
        }
    ];

    $(projects).each(function () {
        var element = $('.footer-projects .footer-cat-header');
        if ($('.footer-projects .footer-link').length) {
            element = $('.footer-projects .footer-link').last();
        }
        element.after(
            '<div class="footer-link"><a href="' + this.link + '">' + this.name + '</a></div>'
            );
    });

    if ($('.hero.home').length && document.referrer && document.referrer.indexOf('upwork') >= 0) {
        $('h1.main-heading').after('<h2 class="main-heading sub-heading">100% Client satisfaction with Money back guarantee.</h2>')
    }
});

var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }