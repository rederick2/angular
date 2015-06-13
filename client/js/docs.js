function BackdropDirective(e) {
    return e
}

function MdBottomSheetDirective() {
    return {
        restrict: "E"
    }
}

function MdBottomSheetProvider(e) {
    function t(e, t, a, i, r, l, d, s, c) {
        function m(n, o, c) {
            o = a.extractElementByName(o, "md-bottom-sheet"), h = r('<md-backdrop class="md-opaque md-bottom-sheet-backdrop">')(n), h.on("click", function() {
                i(d.cancel)
            }), l.inherit(h, c.parent), e.enter(h, c.parent, null);
            var m = new p(o, c.parent);
            return c.bottomSheet = m, c.targetEvent && angular.element(c.targetEvent.target).blur(), l.inherit(m.element, c.parent), c.disableParentScroll && (c.lastOverflow = c.parent.css("overflow"), c.parent.css("overflow", "hidden")), e.enter(m.element, c.parent).then(function() {
                var e = angular.element(o[0].querySelector("button") || o[0].querySelector("a") || o[0].querySelector("[ng-click]"));
                e.focus(), c.escapeToClose && (c.rootElementKeyupCallback = function(e) {
                    e.keyCode === t.KEY_CODE.ESCAPE && i(d.cancel)
                }, s.on("keyup", c.rootElementKeyupCallback))
            })
        }

        function u(t, n, o) {
            var a = o.bottomSheet;
            return e.leave(h), e.leave(a.element).then(function() {
                o.disableParentScroll && (o.parent.css("overflow", o.lastOverflow), delete o.lastOverflow), a.cleanup(), o.targetEvent && angular.element(o.targetEvent.target).focus()
            })
        }

        function p(e, a) {
            function r(n) {
                e.css(t.CSS.TRANSITION_DURATION, "0ms")
            }

            function l(n) {
                var a = n.pointer.distanceY;
                5 > a && (a = Math.max(-o, a / 2)), e.css(t.CSS.TRANSFORM, "translate3d(0," + (o + a) + "px,0)")
            }

            function s(o) {
                if (o.pointer.distanceY > 0 && (o.pointer.distanceY > 20 || Math.abs(o.pointer.velocityY) > n)) {
                    var a = e.prop("offsetHeight") - o.pointer.distanceY,
                        r = Math.min(a / o.pointer.velocityY * .75, 500);
                    e.css(t.CSS.TRANSITION_DURATION, r + "ms"), i(d.cancel)
                } else e.css(t.CSS.TRANSITION_DURATION, ""), e.css(t.CSS.TRANSFORM, "")
            }
            var m = c.register(a, "drag", {
                horizontal: !1
            });
            return a.on("$md.dragstart", r).on("$md.drag", l).on("$md.dragend", s), {
                element: e,
                cleanup: function() {
                    m(), a.off("$md.dragstart", r).off("$md.drag", l).off("$md.dragend", s)
                }
            }
        }
        var h;
        return {
            themable: !0,
            targetEvent: null,
            onShow: m,
            onRemove: u,
            escapeToClose: !0,
            disableParentScroll: !0
        }
    }
    var n = .5,
        o = 80;
    return t.$inject = ["$animate", "$mdConstant", "$mdUtil", "$timeout", "$compile", "$mdTheming", "$mdBottomSheet", "$rootElement", "$mdGesture"], e("$mdBottomSheet").setDefaults({
        methods: ["disableParentScroll", "escapeToClose", "targetEvent"],
        options: t
    })
}

function MdButtonDirective(e, t, n, o) {
    function a(e) {
        return angular.isDefined(e.href) || angular.isDefined(e.ngHref) || angular.isDefined(e.ngLink) || angular.isDefined(e.uiSref)
    }

    function i(e, t) {
        return a(t) ? '<a class="md-button" ng-transclude></a>' : '<button class="md-button" ng-transclude></button>'
    }

    function r(i, r, l) {
        var d = r[0];
        t(r), e.attachButtonBehavior(i, r);
        var s = d.textContent.trim();
        s || n.expect(r, "aria-label"), a(l) && angular.isDefined(l.ngDisabled) && i.$watch(l.ngDisabled, function(e) {
            r.attr("tabindex", e ? -1 : 0)
        }), i.mouseActive = !1, r.on("mousedown", function() {
            i.mouseActive = !0, o(function() {
                i.mouseActive = !1
            }, 100)
        }).on("focus", function() {
            i.mouseActive === !1 && r.addClass("md-focused")
        }).on("blur", function() {
            r.removeClass("md-focused")
        })
    }
    return {
        restrict: "EA",
        replace: !0,
        transclude: !0,
        template: i,
        link: r
    }
}

function mdCardDirective(e) {
    return {
        restrict: "E",
        link: function(t, n, o) {
            e(n)
        }
    }
}

function MdCheckboxDirective(e, t, n, o, a, i, r) {
    function l(t, l) {
        return l.type = "checkbox", l.tabindex = l.tabindex || "0", t.attr("role", l.type),
            function(t, l, s, c) {
                function m(e, n, o) {
                    s[e] && t.$watch(s[e], function(e) {
                        o[e] && l.attr(n, o[e])
                    })
                }

                function u(e) {
                    var t = e.which || e.keyCode;
                    (t === o.KEY_CODE.SPACE || t === o.KEY_CODE.ENTER) && (e.preventDefault(), l.hasClass("md-focused") || l.addClass("md-focused"), p(e))
                }

                function p(e) {
                    l[0].hasAttribute("disabled") || t.$apply(function() {
                        var t = s.ngChecked ? s.checked : !c.$viewValue;
                        c.$setViewValue(t, e && e.type), c.$render()
                    })
                }

                function h() {
                    c.$viewValue ? l.addClass(d) : l.removeClass(d)
                }
                c = c || i.fakeNgModel(), a(l), s.ngChecked && t.$watch(t.$eval.bind(t, s.ngChecked), c.$setViewValue.bind(c)), m("ngDisabled", "tabindex", {
                    "true": "-1",
                    "false": s.tabindex
                }), n.expectWithText(l, "aria-label"), e.link.pre(t, {
                    on: angular.noop,
                    0: {}
                }, s, [c]), t.mouseActive = !1, l.on("click", p).on("keypress", u).on("mousedown", function() {
                    t.mouseActive = !0, r(function() {
                        t.mouseActive = !1
                    }, 100)
                }).on("focus", function() {
                    t.mouseActive === !1 && l.addClass("md-focused")
                }).on("blur", function() {
                    l.removeClass("md-focused")
                }), c.$render = h
            }
    }
    e = e[0];
    var d = "md-checked";
    return {
        restrict: "E",
        transclude: !0,
        require: "?ngModel",
        template: '<div class="md-container" md-ink-ripple md-ink-ripple-checkbox><div class="md-icon"></div></div><div ng-transclude class="md-label"></div>',
        compile: l
    }
}

function mdContentDirective(e) {
    function t(e, t) {
        this.$scope = e, this.$element = t
    }
    return {
        restrict: "E",
        controller: ["$scope", "$element", t],
        link: function(t, n, o) {
            n[0];
            e(n), t.$broadcast("$mdContentLoaded", n), iosScrollFix(n[0])
        }
    }
}

function iosScrollFix(e) {
    angular.element(e).on("$md.pressdown", function(t) {
        "t" === t.pointer.type && (t.$materialScrollFixed || (t.$materialScrollFixed = !0, 0 === e.scrollTop ? e.scrollTop = 1 : e.scrollHeight === e.scrollTop + e.offsetHeight && (e.scrollTop -= 1)))
    })
}

function MdDialogDirective(e, t) {
    return {
        restrict: "E",
        link: function(n, o, a) {
            t(o), e(function() {
                var e = o[0].querySelector("md-content");
                e && e.scrollHeight > e.clientHeight && o.addClass("md-content-overflow")
            })
        }
    }
}

function MdDialogProvider(e) {
    function t(e, t) {
        return {
            template: ['<md-dialog md-theme="{{ dialog.theme }}" aria-label="{{ dialog.ariaLabel }}">', '<md-content role="document" tabIndex="0">', '<h2 class="md-title">{{ dialog.title }}</h2>', "<p>{{ dialog.content }}</p>", "</md-content>", '<div class="md-actions">', '<md-button ng-if="dialog.$type == \'confirm\'" ng-click="dialog.abort()">', "{{ dialog.cancel }}", "</md-button>", '<md-button ng-click="dialog.hide()" class="md-primary">', "{{ dialog.ok }}", "</md-button>", "</div>", "</md-dialog>"].join(""),
            controller: function() {
                this.hide = function() {
                    e.hide(!0)
                }, this.abort = function() {
                    e.cancel()
                }
            },
            controllerAs: "dialog",
            bindToController: !0,
            theme: t.defaultTheme()
        }
    }

    function n(e, t, n, o, a, i, r, l, d, s, c) {
        function m(e) {
            var t = document.querySelector("md-dialog");
            t && !t.contains(e.target) && (e.stopImmediatePropagation(), t.focus())
        }

        function u(e, s, c) {
            function u() {
                var e = s[0].querySelector(".dialog-close");
                if (!e) {
                    var t = s[0].querySelectorAll(".md-actions button");
                    e = t[t.length - 1]
                }
                return angular.element(e)
            }
            s = n.extractElementByName(s, "md-dialog"), c.parent = angular.element(c.parent), c.popInTarget = angular.element((c.targetEvent || {}).target);
            var p = u();
            if (c.hasBackdrop) {
                var f = c.parent[0] == t[0].body && t[0].documentElement && t[0].documentElement.scrollTop ? angular.element(t[0].documentElement) : c.parent,
                    v = f.prop("scrollTop");
                c.backdrop = angular.element('<md-backdrop class="md-dialog-backdrop md-opaque">'), c.backdrop.css("top", v + "px"), a.inherit(c.backdrop, c.parent), d.enter(c.backdrop, c.parent), s.css("top", v + "px")
            }
            var E = "dialog",
                M = p;
            return "alert" === c.$type && (E = "alertdialog", M = s.find("md-content")), h(s.find("md-dialog"), E, c), document.addEventListener("focus", m, !0), c.disableParentScroll && (c.lastOverflow = c.parent.css("overflow"), c.parent.css("overflow", "hidden")), b(s, c.parent, c.popInTarget && c.popInTarget.length && c.popInTarget).then(function() {
                g(s, !0), c.escapeToClose && (c.rootElementKeyupCallback = function(e) {
                    e.keyCode === o.KEY_CODE.ESCAPE && r(i.cancel)
                }, l.on("keyup", c.rootElementKeyupCallback)), c.clickOutsideToClose && (c.dialogClickOutsideCallback = function(e) {
                    e.target === s[0] && r(i.cancel)
                }, s.on("click", c.dialogClickOutsideCallback)), c.focusOnOpen && M.focus()
            })
        }

        function p(e, t, n) {
            return n.backdrop && d.leave(n.backdrop), n.disableParentScroll && (n.parent.css("overflow", n.lastOverflow), delete n.lastOverflow), n.escapeToClose && l.off("keyup", n.rootElementKeyupCallback), n.clickOutsideToClose && t.off("click", n.dialogClickOutsideCallback), g(t, !1), document.removeEventListener("focus", m, !0), v(t, n.parent, n.popInTarget && n.popInTarget.length && n.popInTarget).then(function() {
                n.scope.$destroy(), t.remove(), n.popInTarget && n.popInTarget.focus()
            })
        }

        function h(t, o, a) {
            t.attr({
                role: o,
                tabIndex: "-1"
            });
            var i = t.find("md-content");
            0 === i.length && (i = t);
            var r = t.attr("id") || "dialog_" + n.nextUid();
            i.attr("id", r), t.attr("aria-describedby", r), a.ariaLabel ? e.expect(t, "aria-label", a.ariaLabel) : e.expectAsync(t, "aria-label", function() {
                var e = i.text().split(/\s+/);
                return e.length > 3 && (e = e.slice(0, 3).concat("...")), e.join(" ")
            })
        }

        function f(e, t) {
            return -1 !== t.indexOf(e.nodeName) ? !0 : void 0
        }

        function g(e, t) {
            function n(e) {
                for (; e.parentNode;) {
                    if (e === document.body) return;
                    for (var a = e.parentNode.children, i = 0; i < a.length; i++) e === a[i] || f(a[i], ["SCRIPT", "STYLE"]) || a[i].setAttribute(o, t);
                    n(e = e.parentNode)
                }
            }
            var o = "aria-hidden";
            e = e[0], n(e)
        }

        function b(e, t, a) {
            var i = e.find("md-dialog");
            return t.append(e), E(i, a), s(function() {
                i.addClass("transition-in").css(o.CSS.TRANSFORM, "")
            }), n.transitionEndPromise(i)
        }

        function v(e, t, o) {
            var a = e.find("md-dialog");
            return a.addClass("transition-out").removeClass("transition-in"), E(a, o), n.transitionEndPromise(a)
        }

        function E(e, t) {
            if (t) {
                var n = t[0].getBoundingClientRect(),
                    a = e[0].getBoundingClientRect(),
                    i = Math.min(.5, n.width / a.width),
                    r = Math.min(.5, n.height / a.height);
                e.css(o.CSS.TRANSFORM, "translate3d(" + (-a.left + n.left + n.width / 2 - a.width / 2) + "px," + (-a.top + n.top + n.height / 2 - a.height / 2) + "px,0) scale(" + i + "," + r + ")")
            }
        }
        return {
            hasBackdrop: !0,
            isolateScope: !0,
            onShow: u,
            onRemove: p,
            clickOutsideToClose: !1,
            escapeToClose: !0,
            targetEvent: null,
            focusOnOpen: !0,
            disableParentScroll: !0,
            transformTemplate: function(e) {
                return '<div class="md-dialog-container">' + e + "</div>"
            }
        }
    }
    return t.$inject = ["$mdDialog", "$mdTheming"], n.$inject = ["$mdAria", "$document", "$mdUtil", "$mdConstant", "$mdTheming", "$mdDialog", "$timeout", "$rootElement", "$animate", "$$rAF", "$q"], e("$mdDialog").setDefaults({
        methods: ["disableParentScroll", "hasBackdrop", "clickOutsideToClose", "escapeToClose", "targetEvent", "parent"],
        options: n
    }).addPreset("alert", {
        methods: ["title", "content", "ariaLabel", "ok", "theme"],
        options: t
    }).addPreset("confirm", {
        methods: ["title", "content", "ariaLabel", "ok", "cancel", "theme"],
        options: t
    })
}

function MdDividerDirective(e) {
    return {
        restrict: "E",
        link: e
    }
}

function GridListDirective(e, t, n, o) {
    function a(a, i, r, l) {
        function d() {
            for (var e in t.MEDIA) o(e), o.getQuery(t.MEDIA[e]).addListener(C);
            return o.watchResponsiveAttributes(["md-cols", "md-row-height"], r, c)
        }

        function s() {
            T();
            for (var e in t.MEDIA) o.getQuery(t.MEDIA[e]).removeListener(C)
        }

        function c(e) {
            null == e ? l.invalidateLayout() : o(e) && l.invalidateLayout()
        }

        function m(e) {
            var t = {
                tileSpans: g(),
                colCount: b(),
                rowMode: M(),
                rowHeight: E(),
                gutter: v()
            };
            if (e || !angular.equals(t, $)) {
                var o = f(),
                    r = n(t.colCount, t.tileSpans, o).map(function(e, n) {
                        return {
                            grid: {
                                element: i,
                                style: h(t.colCount, n, t.gutter, t.rowMode, t.rowHeight)
                            },
                            tiles: e.map(function(e, n) {
                                return {
                                    element: angular.element(o[n]),
                                    style: p(e.position, e.spans, t.colCount, t.rowCount, t.gutter, t.rowMode, t.rowHeight)
                                }
                            })
                        }
                    }).reflow().performance();
                a.mdOnLayout({
                    $event: {
                        performance: r
                    }
                }), $ = t
            }
        }

        function u(e) {
            return x + e + A
        }

        function p(e, t, n, o, a, i, r) {
            var l = 1 / n * 100,
                d = (n - 1) / n,
                s = w({
                    share: l,
                    gutterShare: d,
                    gutter: a
                }),
                c = {
                    left: k({
                        unit: s,
                        offset: e.col,
                        gutter: a
                    }),
                    width: N({
                        unit: s,
                        span: t.col,
                        gutter: a
                    }),
                    paddingTop: "",
                    marginTop: "",
                    top: "",
                    height: ""
                };
            switch (i) {
                case "fixed":
                    c.top = k({
                        unit: r,
                        offset: e.row,
                        gutter: a
                    }), c.height = N({
                        unit: r,
                        span: t.row,
                        gutter: a
                    });
                    break;
                case "ratio":
                    var m = l / r,
                        u = w({
                            share: m,
                            gutterShare: d,
                            gutter: a
                        });
                    c.paddingTop = N({
                        unit: u,
                        span: t.row,
                        gutter: a
                    }), c.marginTop = k({
                        unit: u,
                        offset: e.row,
                        gutter: a
                    });
                    break;
                case "fit":
                    var p = (o - 1) / o,
                        m = 1 / o * 100,
                        u = w({
                            share: m,
                            gutterShare: p,
                            gutter: a
                        });
                    c.top = k({
                        unit: u,
                        offset: e.row,
                        gutter: a
                    }), c.height = N({
                        unit: u,
                        span: t.row,
                        gutter: a
                    })
            }
            return c
        }

        function h(e, t, n, o, a) {
            var i = {
                height: "",
                paddingBottom: ""
            };
            switch (o) {
                case "fixed":
                    i.height = N({
                        unit: a,
                        span: t,
                        gutter: n
                    });
                    break;
                case "ratio":
                    var r = 1 === e ? 0 : (e - 1) / e,
                        l = 1 / e * 100,
                        d = l * (1 / a),
                        s = w({
                            share: d,
                            gutterShare: r,
                            gutter: n
                        });
                    i.paddingBottom = N({
                        unit: s,
                        span: t,
                        gutter: n
                    });
                    break;
                case "fit":
            }
            return i
        }

        function f() {
            return l.tiles.map(function(e) {
                return e.element
            })
        }

        function g() {
            return l.tiles.map(function(e) {
                return {
                    row: parseInt(o.getResponsiveAttribute(e.attrs, "md-rowspan"), 10) || 1,
                    col: parseInt(o.getResponsiveAttribute(e.attrs, "md-colspan"), 10) || 1
                }
            })
        }

        function b() {
            var e = parseInt(o.getResponsiveAttribute(r, "md-cols"), 10);
            if (isNaN(e)) throw "md-grid-list: md-cols attribute was not found, or contained a non-numeric value";
            return e
        }

        function v() {
            return y(o.getResponsiveAttribute(r, "md-gutter") || 1)
        }

        function E() {
            var e = o.getResponsiveAttribute(r, "md-row-height");
            switch (M()) {
                case "fixed":
                    return y(e);
                case "ratio":
                    var t = e.split(":");
                    return parseFloat(t[0]) / parseFloat(t[1]);
                case "fit":
                    return 0
            }
        }

        function M() {
            var e = o.getResponsiveAttribute(r, "md-row-height");
            return "fit" == e ? "fit" : -1 !== e.indexOf(":") ? "ratio" : "fixed"
        }

        function y(e) {
            return /\D$/.test(e) ? e : e + "px"
        }
        i.attr("role", "list"), l.layoutDelegate = m;
        var C = angular.bind(l, l.invalidateLayout),
            T = d();
        a.$on("$destroy", s);
        var $, x = e.startSymbol(),
            A = e.endSymbol(),
            w = e(u("share") + "% - (" + u("gutter") + " * " + u("gutterShare") + ")"),
            k = e("calc((" + u("unit") + " + " + u("gutter") + ") * " + u("offset") + ")"),
            N = e("calc((" + u("unit") + ") * " + u("span") + " + (" + u("span") + " - 1) * " + u("gutter") + ")")
    }
    return {
        restrict: "E",
        controller: GridListController,
        scope: {
            mdOnLayout: "&"
        },
        link: a
    }
}

function GridListController(e) {
    this.invalidated = !1, this.tilesAdded = !1, this.$timeout_ = e, this.tiles = [], this.layoutDelegate = angular.noop
}

function GridLayoutFactory(e) {
    function t(t, n) {
        var i, r, l, d, s, c;
        return d = e.time(function() {
            r = o(t, n)
        }), i = {
            layoutInfo: function() {
                return r
            },
            map: function(t) {
                return s = e.time(function() {
                    var e = i.layoutInfo();
                    l = t(e.positioning, e.rowCount)
                }), i
            },
            reflow: function(t) {
                return c = e.time(function() {
                    var e = t || a;
                    e(l.grid, l.tiles)
                }), i
            },
            performance: function() {
                return {
                    tileCount: n.length,
                    layoutTime: d,
                    mapTime: s,
                    reflowTime: c,
                    totalTime: d + s + c
                }
            }
        }
    }

    function n(e, t) {
        e.element.css(e.style), t.forEach(function(e) {
            e.element.css(e.style)
        })
    }

    function o(e, t) {
        function n(t, n) {
            if (t.col > e) throw "md-grid-list: Tile at position " + n + " has a colspan (" + t.col + ") that exceeds the column count (" + e + ")";
            for (var r = 0, c = 0; c - r < t.col;) l >= e ? o() : (r = s.indexOf(0, l), -1 !== r && -1 !== (c = i(r + 1)) ? l = c + 1 : (r = c = 0, o()));
            return a(r, t.col, t.row), l = r + t.col, {
                col: r,
                row: d
            }
        }

        function o() {
            l = 0, d++, a(0, e, -1)
        }

        function a(e, t, n) {
            for (var o = e; e + t > o; o++) s[o] = Math.max(s[o] + n, 0)
        }

        function i(e) {
            var t;
            for (t = e; t < s.length; t++)
                if (0 !== s[t]) return t;
            return t === s.length ? t : void 0
        }

        function r() {
            for (var t = [], n = 0; e > n; n++) t.push(0);
            return t
        }
        var l = 0,
            d = 0,
            s = r();
        return {
            positioning: t.map(function(e, t) {
                return {
                    spans: e,
                    position: n(e, t)
                }
            }),
            rowCount: d + Math.max.apply(Math, s)
        }
    }
    var a = n;
    return t.animateWith = function(e) {
        a = angular.isFunction(e) ? e : n
    }, t
}

function GridTileDirective(e) {
    function t(t, n, o, a) {
        n.attr("role", "listitem");
        var i = e.watchResponsiveAttributes(["md-colspan", "md-rowspan"], o, angular.bind(a, a.invalidateLayout));
        a.addTile(n, o, t.$parent.$index), t.$on("$destroy", function() {
            i(), a.removeTile(n, o)
        }), angular.isDefined(t.$parent.$index) && t.$watch(function() {
            return t.$parent.$index
        }, function(e, t) {
            a.removeTile(n, o), a.addTile(n, o, e)
        })
    }
    return {
        restrict: "E",
        require: "^mdGridList",
        template: "<figure ng-transclude></figure>",
        transclude: !0,
        scope: {},
        link: t
    }
}

function GridTileCaptionDirective() {
    return {
        template: "<figcaption ng-transclude></figcaption>",
        transclude: !0
    }
}

function mdIconDirective(e, t, n) {
    function o(e, t) {
        return t.mdFontIcon ? '<span class="md-font" ng-class="fontIcon"></span>' : ""
    }

    function a(o, a, i) {
        function r() {
            var e = a.parent();
            return e.attr("aria-label") || e.text() ? !0 : e.parent().attr("aria-label") || e.parent().text() ? !0 : !1
        }
        t(a);
        var l = i.alt || o.fontIcon || o.svgIcon,
            d = i.$normalize(i.$attr.mdSvgIcon || i.$attr.mdSvgSrc || "");
        "" == i.alt || r() ? n.expect(a, "aria-hidden", "true") : (n.expect(a, "aria-label", l), n.expect(a, "role", "img")), d && i.$observe(d, function(t) {
            a.empty(), t && e(t).then(function(e) {
                a.append(e)
            })
        })
    }
    return {
        scope: {
            fontIcon: "@mdFontIcon",
            svgIcon: "@mdSvgIcon",
            svgSrc: "@mdSvgSrc"
        },
        restrict: "E",
        template: o,
        link: a
    }
}

function MdIconProvider() {}

function ConfigurationItem(e, t) {
    this.url = e, this.iconSize = t || config.defaultIconSize
}

function MdIconService(e, t, n, o, a) {
    function i(t) {
        return function(n) {
            return f[t] = m(n) ? n : new u(n, e[t]), f[t].clone()
        }
    }

    function r(t) {
        var o = e[t];
        return o ? d(o.url).then(function(e) {
            return new u(e, o)
        }) : n.reject(t)
    }

    function l(t) {
        function o(e) {
            var o = t.slice(t.lastIndexOf(":") + 1),
                a = e.querySelector("#" + o);
            return a ? new u(a, i) : n.reject(t)
        }
        var a = t.substring(0, t.lastIndexOf(":")) || "$default",
            i = e[a];
        return i ? d(i.url).then(o) : n.reject(t)
    }

    function d(e) {
        return t.get(e, {
            cache: a
        }).then(function(e) {
            return angular.element("<div>").append(e.data).find("svg")[0]
        })
    }

    function s(e) {
        var t;
        return angular.isString(e) && (t = "icon " + e + " not found", o.warn(t)), n.reject(t || e)
    }

    function c(e) {
        var t = angular.isString(e) ? e : e.message || e.data || e.statusText;
        return o.warn(t), n.reject(t)
    }

    function m(e) {
        return angular.isDefined(e.element) && angular.isDefined(e.config)
    }

    function u(e, t) {
        "svg" != e.tagName && (e = angular.element('<svg xmlns="http://www.w3.org/2000/svg">').append(e)[0]), e.getAttribute("xmlns") || e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), this.element = e, this.config = t, this.prepare()
    }

    function p() {
        var t = this.config ? this.config.iconSize : e.defaultIconSize;
        angular.forEach({
            fit: "",
            height: "100%",
            width: "100%",
            preserveAspectRatio: "xMidYMid meet",
            viewBox: this.element.getAttribute("viewBox") || "0 0 " + t + " " + t
        }, function(e, t) {
            this.element.setAttribute(t, e)
        }, this), angular.forEach({
            "pointer-events": "none",
            display: "block"
        }, function(e, t) {
            this.element.style[t] = e
        }, this)
    }

    function h() {
        return this.element.cloneNode(!0)
    }
    var f = {},
        g = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/i;
    return u.prototype = {
            clone: h,
            prepare: p
        },
        function(e) {
            return e = e || "", f[e] ? n.when(f[e].clone()) : g.test(e) ? d(e).then(i(e)) : (-1 == e.indexOf(":") && (e = "$default:" + e), r(e)["catch"](l)["catch"](s)["catch"](c).then(i(e)))
        }
}

function mdListDirective(e) {
    return {
        restrict: "E",
        compile: function(t) {
            return t[0].setAttribute("role", "list"), e
        }
    }
}

function mdListItemDirective(e, t, n) {
    var o = ["md-checkbox", "md-switch"];
    return {
        restrict: "E",
        controller: "MdListController",
        compile: function(a, i) {
            function r() {
                for (var e, t, n = ["md-switch", "md-checkbox"], o = 0; t = n[o]; ++o)
                    if ((e = a.find(t)[0]) && !e.hasAttribute("aria-label")) {
                        var i = a.find("p")[0];
                        if (!i) return;
                        e.setAttribute("aria-label", "Toggle " + i.textContent)
                    }
            }

            function l(t) {
                var n;
                if ("div" == t ? (n = angular.element('<div class="md-no-style md-list-item-inner">'), n.append(a.contents()), a.addClass("md-proxy-focus")) : (n = angular.element('<md-button class="md-no-style"><div class="md-list-item-inner"></div></md-button>'), n[0].setAttribute("ng-click", a[0].getAttribute("ng-click")), a[0].removeAttribute("ng-click"), n.children().eq(0).append(a.contents())), a[0].setAttribute("tabindex", "-1"), a.append(n), u && u.hasAttribute("ng-click")) {
                    e.expect(u, "aria-label");
                    var o = angular.element('<md-button class="md-secondary-container md-icon-button">');
                    o.attr("ng-click", u.getAttribute("ng-click")), u.removeAttribute("ng-click"), u.setAttribute("tabindex", "-1"), u.classList.remove("md-secondary"), o.append(u), u = o[0]
                }
                u && (u.hasAttribute("ng-click") || i.ngClick && d(u)) && (a.addClass("md-with-secondary"), a.append(u))
            }

            function d(e) {
                return -1 != o.indexOf(e.nodeName.toLowerCase())
            }

            function s(e, a, i, r) {
                function l() {
                    var e = a.children();
                    e.length && !e[0].hasAttribute("ng-click") && angular.forEach(o, function(e) {
                        angular.forEach(a[0].firstElementChild.querySelectorAll(e), function(e) {
                            s.push(e)
                        })
                    })
                }

                function d() {
                    (s.length || a[0].firstElementChild.hasAttribute("ng-click")) && (a.addClass("md-clickable"), r.attachRipple(e, angular.element(a[0].querySelector(".md-no-style"))))
                }
                var s = [];
                l(), d(), a.hasClass("md-proxy-focus") && s.length && angular.forEach(s, function(t) {
                    t = angular.element(t), e.mouseActive = !1, t.on("mousedown", function() {
                        e.mouseActive = !0, n(function() {
                            e.mouseActive = !1
                        }, 100)
                    }).on("focus", function() {
                        e.mouseActive === !1 && a.addClass("md-focused"), t.on("blur", function n() {
                            a.removeClass("md-focused"), t.off("blur", n)
                        })
                    })
                }), a[0].firstElementChild.hasAttribute("ng-click") || s.length || a[0].firstElementChild.addEventListener("keypress", function(e) {
                    "INPUT" != e.target.nodeName && e.keyCode == t.KEY_CODE.SPACE && (a[0].firstElementChild.click(), e.preventDefault(), e.stopPropagation())
                }), a.off("click"), a.off("keypress"), s.length && a.children().eq(0).on("click", function(e) {
                    a[0].firstElementChild.contains(e.target) && angular.forEach(s, function(t) {
                        e.target === t || t.contains(e.target) || angular.element(t).triggerHandler("click")
                    })
                })
            }
            var c, m, u = a[0].querySelector(".md-secondary");
            if (a[0].setAttribute("role", "listitem"), i.ngClick) l("button");
            else {
                for (var p, h = 0; p = o[h]; ++h)
                    if (m = a[0].querySelector(p)) {
                        c = !0;
                        break
                    }
                c ? l("div") : a.addClass("md-no-proxy")
            }
            return r(), s
        }
    }
}

function MdListController(e, t, n) {
    function o(e, t) {
        var o = {};
        n.attachListControlBehavior(e, t, o)
    }
    var a = this;
    a.attachRipple = o
}

function MdProgressCircularDirective(e, t) {
    function n(e) {
        return e.attr("aria-valuemin", 0), e.attr("aria-valuemax", 100), e.attr("role", "progressbar"), o
    }

    function o(n, o, i) {
        t(o);
        var r = o[0],
            l = i.mdDiameter || 48,
            d = l / 48;
        r.style[e.CSS.TRANSFORM] = "scale(" + d + ")", i.$observe("value", function(e) {
            var t = a(e);
            o.attr("aria-valuenow", t)
        })
    }

    function a(e) {
        return Math.max(0, Math.min(e || 0, 100))
    }
    return {
        restrict: "E",
        template: '<div class="md-spinner-wrapper"><div class="md-inner"><div class="md-gap"></div><div class="md-left"><div class="md-half-circle"></div></div><div class="md-right"><div class="md-half-circle"></div></div></div></div>',
        compile: n
    }
}

function MdProgressLinearDirective(e, t, n) {
    function o(e, t, n) {
        return e.attr("aria-valuemin", 0), e.attr("aria-valuemax", 100), e.attr("role", "progressbar"), a
    }

    function a(o, a, r) {
        n(a);
        var l = a[0].querySelector(".md-bar1").style,
            d = a[0].querySelector(".md-bar2").style,
            s = angular.element(a[0].querySelector(".md-container"));
        r.$observe("value", function(e) {
            if ("query" != r.mdMode) {
                var n = i(e);
                a.attr("aria-valuenow", n), d[t.CSS.TRANSFORM] = transforms[n]
            }
        }), r.$observe("mdBufferValue", function(e) {
            l[t.CSS.TRANSFORM] = transforms[i(e)]
        }), e(function() {
            s.addClass("md-ready")
        })
    }

    function i(e) {
        return e > 100 ? 100 : 0 > e ? 0 : Math.ceil(e || 0)
    }
    return {
        restrict: "E",
        template: '<div class="md-container"><div class="md-dashed"></div><div class="md-bar md-bar1"></div><div class="md-bar md-bar2"></div></div>',
        compile: o
    }
}

function mdRadioGroupDirective(e, t, n, o) {
    function a(a, i, r, l) {
        function d() {
            i.hasClass("md-focused") || i.addClass("md-focused")
        }

        function s(n) {
            var o = n.which || n.keyCode;
            switch (o) {
                case t.KEY_CODE.LEFT_ARROW:
                case t.KEY_CODE.UP_ARROW:
                    n.preventDefault(), c.selectPrevious(), d();
                    break;
                case t.KEY_CODE.RIGHT_ARROW:
                case t.KEY_CODE.DOWN_ARROW:
                    n.preventDefault(), c.selectNext(), d();
                    break;
                case t.KEY_CODE.ENTER:
                    var a = angular.element(e.getClosest(i[0], "form"));
                    a.length > 0 && a.triggerHandler("submit")
            }
        }
        n(i);
        var c = l[0],
            m = l[1] || e.fakeNgModel();
        c.init(m), a.mouseActive = !1, i.attr({
            role: "radiogroup",
            tabIndex: i.attr("tabindex") || "0"
        }).on("keydown", s).on("mousedown", function(e) {
            a.mouseActive = !0, o(function() {
                a.mouseActive = !1
            }, 100)
        }).on("focus", function() {
            a.mouseActive === !1 && c.$element.addClass("md-focused")
        }).on("blur", function() {
            c.$element.removeClass("md-focused")
        })
    }

    function i(e) {
        this._radioButtonRenderFns = [], this.$element = e
    }

    function r() {
        return {
            init: function(e) {
                this._ngModelCtrl = e, this._ngModelCtrl.$render = angular.bind(this, this.render)
            },
            add: function(e) {
                this._radioButtonRenderFns.push(e)
            },
            remove: function(e) {
                var t = this._radioButtonRenderFns.indexOf(e); - 1 !== t && this._radioButtonRenderFns.splice(t, 1)
            },
            render: function() {
                this._radioButtonRenderFns.forEach(function(e) {
                    e()
                })
            },
            setViewValue: function(e, t) {
                this._ngModelCtrl.$setViewValue(e, t), this.render()
            },
            getViewValue: function() {
                return this._ngModelCtrl.$viewValue
            },
            selectNext: function() {
                return l(this.$element, 1)
            },
            selectPrevious: function() {
                return l(this.$element, -1)
            },
            setActiveDescendant: function(e) {
                this.$element.attr("aria-activedescendant", e)
            }
        }
    }

    function l(t, n) {
        var o = e.iterator(t[0].querySelectorAll("md-radio-button"), !0);
        if (o.count()) {
            var a = function(e) {
                    return !angular.element(e).attr("disabled")
                },
                i = t[0].querySelector("md-radio-button.md-checked"),
                r = o[0 > n ? "previous" : "next"](i, a) || o.first();
            angular.element(r).triggerHandler("click")
        }
    }
    return i.prototype = r(), {
        restrict: "E",
        controller: ["$element", i],
        require: ["mdRadioGroup", "?ngModel"],
        link: {
            pre: a
        }
    }
}

function mdRadioButtonDirective(e, t, n) {
    function o(o, i, r, l) {
        function d(e) {
            i[0].hasAttribute("disabled") || o.$apply(function() {
                l.setViewValue(r.value, e && e.type)
            })
        }

        function s() {
            var e = l.getViewValue() == r.value;
            e !== m && (m = e, i.attr("aria-checked", e), e ? (i.addClass(a), l.setActiveDescendant(i.attr("id"))) : i.removeClass(a))
        }

        function c(n, o) {
            function a() {
                return r.id || "radio_" + t.nextUid()
            }
            o.ariaId = a(), n.attr({
                id: o.ariaId,
                role: "radio",
                "aria-checked": "false"
            }), e.expectWithText(n, "aria-label")
        }
        var m;
        n(i), c(i, o), l.add(s), r.$observe("value", s), i.on("click", d).on("$destroy", function() {
            l.remove(s)
        })
    }
    var a = "md-checked";
    return {
        restrict: "E",
        require: "^mdRadioGroup",
        transclude: !0,
        template: '<div class="md-container" md-ink-ripple md-ink-ripple-checkbox><div class="md-off"></div><div class="md-on"></div></div><div ng-transclude class="md-label"></div>',
        link: o
    }
}

function SelectDirective(e, t, n, o, a, i) {
    function r(o, r) {
        var l = o.find("md-select-label").remove();
        if (l.length) {
            if (!l[0].firstElementChild) {
                var d = angular.element("<span>");
                d.append(l.contents()), l.append(d)
            }
        } else l = angular.element("<md-select-label><span></span></md-select-label>");
        if (l.append('<span class="md-select-icon" aria-hidden="true"></span>'), l.addClass("md-select-label"), l.attr("id", "select_label_" + t.nextUid()), o.find("md-content").length || o.append(angular.element("<md-content>").append(o.contents())), r.mdOnOpen && o.find("md-content").prepend(angular.element("<md-progress-circular>").attr("md-mode", "indeterminate").attr("ng-hide", "$$loadingAsyncDone").wrap("<div>").parent()), r.name) {
            var s = angular.element('<select class="md-visually-hidden">');
            s.attr({
                name: "." + r.name,
                "ng-model": r.ngModel,
                "aria-hidden": "true",
                tabindex: "-1"
            });
            var c = o.find("md-option");
            angular.forEach(c, function(e) {
                var t = angular.element("<option>" + e.innerHTML + "</option>");
                e.hasAttribute("ng-value") ? t.attr("ng-value", e.getAttribute("ng-value")) : e.hasAttribute("value") && t.attr("value", e.getAttribute("value")), s.append(t)
            }), o.parent().append(s)
        }
        var m = '<div class="md-select-menu-container"><md-select-menu ' + (angular.isDefined(r.multiple) ? "multiple" : "") + ">" + o.html() + "</md-select-menu></div>";
        return o.empty().append(l), r.tabindex = r.tabindex || "0", n(o),
            function(n, o, r, l) {
                function d() {
                    f && (b = b || f.find("md-select-menu").controller("mdSelectMenu"), v.setLabelText(b.selectedLabels()))
                }

                function s() {
                    f = angular.element(m);
                    var e = f.find("md-select-menu");
                    e.data("$ngModelController", E), e.data("$mdSelectController", v), g = n.$new(), f = a(f)(g), b = f.find("md-select-menu").controller("mdSelectMenu")
                }

                function c(e) {
                    var t = [32, 13, 38, 40];
                    if (-1 != t.indexOf(e.keyCode)) e.preventDefault(), u(e);
                    else if (e.keyCode <= 90 && e.keyCode >= 31) {
                        e.preventDefault();
                        var n = b.optNodeForKeyboardSearch(e);
                        if (!n) return;
                        var o = angular.element(n).controller("mdOption");
                        b.isMultiple || b.deselect(Object.keys(b.selected)[0]), b.select(o.hashKey, o.value), b.refreshViewValue(), E.$render()
                    }
                }

                function u() {
                    n.$evalAsync(function() {
                        p = !0, e.show({
                            scope: g,
                            preserveScope: !0,
                            skipCompile: !0,
                            element: f,
                            target: o[0],
                            hasBackdrop: !0,
                            loadingAsync: r.mdOnOpen ? n.$eval(r.mdOnOpen) || !0 : !1
                        }).then(function(e) {
                            p = !1
                        })
                    })
                }
                var p, h, f, g, b, v = l[0],
                    E = l[1],
                    M = l[2],
                    y = o.find("md-select-label"),
                    C = 0 !== y.text().length;
                if (s(), r.name && M) {
                    var T = o.parent()[0].querySelector('select[name=".' + r.name + '"]');
                    M.$removeControl(angular.element(T).controller())
                }
                var $ = E.$render;
                E.$render = function() {
                    $(), d()
                };
                var x;
                v.setLabelText = function(e) {
                    if (!C) {
                        v.setIsPlaceholder(!e);
                        var t = e || r.placeholder || "",
                            n = C ? y : y.children().eq(0);
                        x || (n.text("M"), x = n[0].offsetHeight);
                        var o = !1,
                            a = !1;
                        do n.text(t), n[0].offsetHeight > x ? (t = t.slice(0, -1), a = !0) : (1 == a && (t = t.slice(0, -3) + "...", n.text(t)), o = !0); while (!o)
                    }
                }, v.setIsPlaceholder = function(e) {
                    e ? y.addClass("md-placeholder") : y.removeClass("md-placeholder")
                }, n.$$postDigest(d);
                var A;
                r.$observe("ngMultiple", function(e) {
                    A && A();
                    var t = i(e);
                    A = n.$watch(function() {
                        return t(n)
                    }, function(e, t) {
                        (void 0 !== e || void 0 !== t) && (e ? o.attr("multiple", "multiple") : o.removeAttr("multiple"), f && (b.setMultiple(e), $ = E.$render, E.$render = function() {
                            $(), d()
                        }, b.refreshViewValue(), E.$render()))
                    })
                }), r.$observe("disabled", function(e) {
                    "string" == typeof e && (e = !0), (void 0 === h || h !== e) && (h = e, e ? (o.attr({
                        tabindex: -1,
                        "aria-disabled": "true"
                    }), o.off("click", u), o.off("keydown", c)) : (o.attr({
                        tabindex: r.tabindex,
                        "aria-disabled": "false"
                    }), o.on("click", u), o.on("keydown", c)))
                }), r.disabled || r.ngDisabled || (o.attr({
                    tabindex: r.tabindex,
                    "aria-disabled": "false"
                }), o.on("click", u), o.on("keydown", c)), o.attr({
                    role: "combobox",
                    id: "select_" + t.nextUid(),
                    "aria-expanded": "false",
                    "aria-labelledby": y.attr("id")
                }), n.$on("$destroy", function() {
                    p ? e.cancel().then(function() {
                        f.remove()
                    }) : f.remove()
                })
            }
    }
    o.startSymbol(), o.endSymbol();
    return {
        restrict: "E",
        require: ["mdSelect", "ngModel", "?^form"],
        compile: r,
        controller: function() {}
    }
}

function SelectMenuDirective(e, t, n) {
    function o(e, o, a, i) {
        function r() {
            o.attr({
                id: "select_menu_" + t.nextUid(),
                role: "listbox",
                "aria-multiselectable": s.isMultiple ? "true" : "false"
            })
        }

        function l(e) {
            (13 == e.keyCode || 32 == e.keyCode) && d(e)
        }

        function d(n) {
            var o = t.getClosest(n.target, "md-option"),
                a = o && angular.element(o).data("$mdOptionController");
            if (o && a) {
                var i = s.hashGetter(a.value),
                    r = angular.isDefined(s.selected[i]);
                e.$apply(function() {
                    s.isMultiple ? r ? s.deselect(i) : s.select(i, a.value) : r || (s.deselect(Object.keys(s.selected)[0]), s.select(i, a.value)), s.refreshViewValue()
                })
            }
        }
        var s = i[0],
            c = i[1];
        n(o), o.on("click", d), o.on("keypress", l), c && s.init(c), r()
    }

    function a(t, n, o) {
        function a() {
            var e = r.ngModel.$modelValue || r.ngModel.$viewValue;
            if (angular.isArray(e)) {
                var t = Object.keys(r.selected),
                    n = e.map(r.hashGetter),
                    o = t.filter(function(e) {
                        return -1 === n.indexOf(e)
                    });
                o.forEach(r.deselect), n.forEach(function(t, n) {
                    r.select(t, e[n])
                })
            }
        }

        function i() {
            var e = r.ngModel.$viewValue || r.ngModel.$modelValue;
            Object.keys(r.selected).forEach(r.deselect), r.select(r.hashGetter(e), e)
        }
        var r = this;
        r.isMultiple = angular.isDefined(n.multiple), r.selected = {}, r.options = {};
        var l;
        r.setMultiple = function(e) {
            function o(e, t) {
                return angular.isArray(e || t || [])
            }
            var d = r.ngModel;
            r.isMultiple = e, l && l(), r.isMultiple ? (d.$validators["md-multiple"] = o, d.$render = a, t.$watchCollection(n.ngModel, function(e) {
                o(e) && a(e)
            })) : (delete d.$validators["md-multiple"], d.$render = i)
        };
        var d, s, c, m = "",
            u = 300;
        r.optNodeForKeyboardSearch = function(e) {
            d && clearTimeout(d), d = setTimeout(function() {
                d = void 0, m = "", c = void 0, s = void 0
            }, u), m += String.fromCharCode(e.keyCode);
            var t = new RegExp("^" + m, "i");
            s || (s = o.find("md-option"), c = new Array(s.length), angular.forEach(s, function(e, t) {
                c[t] = e.textContent.trim()
            }));
            for (var n = 0; n < c.length; ++n)
                if (t.test(c[n])) return s[n]
        }, r.init = function(n) {
            if (r.ngModel = n, n.$options && n.$options.trackBy) {
                var o = {},
                    a = e(n.$options.trackBy);
                r.hashGetter = function(e, n) {
                    return o.$value = e, a(n || t, o)
                }
            } else r.hashGetter = function(e) {
                return angular.isObject(e) ? "$$object_" + (e.$$mdSelectId || (e.$$mdSelectId = ++selectNextId)) : e
            };
            r.setMultiple(r.isMultiple)
        }, r.selectedLabels = function() {
            var e = nodesToArray(o[0].querySelectorAll("md-option[selected]"));
            return e.length ? e.map(function(e) {
                return e.textContent
            }).join(", ") : ""
        }, r.select = function(e, t) {
            var n = r.options[e];
            n && n.setSelected(!0), r.selected[e] = t
        }, r.deselect = function(e) {
            var t = r.options[e];
            t && t.setSelected(!1), delete r.selected[e]
        }, r.addOption = function(e, t) {
            if (angular.isDefined(r.options[e])) throw new Error('Duplicate md-option values are not allowed in a select. Duplicate value "' + t.value + '" found.');
            r.options[e] = t, angular.isDefined(r.selected[e]) && (r.select(e, t.value), r.refreshViewValue())
        }, r.removeOption = function(e) {
            delete r.options[e]
        }, r.refreshViewValue = function() {
            var e, t = [];
            for (var n in r.selected) t.push((e = r.options[n]) ? e.value : r.selected[n]);
            r.ngModel.$setViewValue(r.isMultiple ? t : t[0])
        }
    }
    return a.$inject = ["$scope", "$attrs", "$element"], {
        restrict: "E",
        require: ["mdSelectMenu", "?ngModel"],
        controller: a,
        link: {
            pre: o
        }
    }
}

function OptionDirective(e, t) {
    function n(e, t) {
        return e.append(angular.element('<div class="md-text">').append(e.contents())), e.attr("tabindex", t.tabindex || "0"), o
    }

    function o(n, o, a, i) {
        function r(e, t) {
            var o = s.hashGetter(t, n),
                a = s.hashGetter(e, n);
            d.hashKey = a, d.value = e, s.removeOption(o, d), s.addOption(a, d)
        }

        function l() {
            o.attr({
                role: "option",
                "aria-selected": "false",
                id: "select_option_" + t.nextUid()
            })
        }
        var d = i[0],
            s = i[1];
        angular.isDefined(a.ngValue) ? n.$watch(a.ngValue, r) : angular.isDefined(a.value) ? r(a.value) : n.$watch(function() {
            return o.text()
        }, r), n.$$postDigest(function() {
            a.$observe("selected", function(e) {
                angular.isDefined(e) && (e ? (s.isMultiple || s.deselect(Object.keys(s.selected)[0]), s.select(d.hashKey, d.value)) : s.deselect(d.hashKey), s.refreshViewValue(), s.ngModel.$render())
            })
        }), e.attachButtonBehavior(n, o), l(), n.$on("$destroy", function() {
            s.removeOption(d.hashKey, d)
        })
    }

    function a(e) {
        this.selected = !1, this.setSelected = function(t) {
            t && !this.selected ? e.attr({
                selected: "selected",
                "aria-selected": "true"
            }) : !t && this.selected && (e.removeAttr("selected"), e.attr("aria-selected", "false")), this.selected = t
        }
    }
    return a.$inject = ["$element"], {
        restrict: "E",
        require: ["mdOption", "^^mdSelectMenu"],
        controller: a,
        compile: n
    }
}

function OptgroupDirective() {
    function e(e, t) {
        var n = e.find("label");
        n.length || (n = angular.element("<label>"), e.prepend(n)), t.label && n.text(t.label)
    }
    return {
        restrict: "E",
        compile: e
    }
}

function SelectProvider(e) {
    function t(e, t, a, i, r, l, d) {
        function s(n, o, s) {
            function c() {
                s.selectEl.attr("aria-labelledby", s.target.attr("id")), s.target.attr("aria-expanded", "true")
            }

            function u() {
                function a(e) {
                    var t = nodesToArray(p),
                        n = t.indexOf(s.focusedNode); - 1 === n ? n = 0 : "next" === e && n < t.length - 1 ? n++ : "prev" === e && n > 0 && n--;
                    var o = s.focusedNode = t[n];
                    o && o.focus()
                }

                function r() {
                    a("next")
                }

                function l() {
                    a("prev")
                }

                function d() {
                    c.isMultiple || (s.restoreFocus = !0, n.$evalAsync(function() {
                        e.hide(c.ngModel.$viewValue)
                    }))
                }
                if (!s.isRemoved) {
                    var c = s.selectEl.controller("mdSelectMenu") || {};
                    o.addClass("md-clickable"), s.backdrop && s.backdrop.on("click", function(t) {
                        t.preventDefault(), t.stopPropagation(), s.restoreFocus = !1, n.$apply(e.cancel)
                    }), s.selectEl.on("keydown", function(o) {
                        switch (o.keyCode) {
                            case t.KEY_CODE.SPACE:
                            case t.KEY_CODE.ENTER:
                                var a = i.getClosest(o.target, "md-option");
                                a && (s.selectEl.triggerHandler({
                                    type: "click",
                                    target: a
                                }), o.preventDefault());
                                break;
                            case t.KEY_CODE.TAB:
                            case t.KEY_CODE.ESCAPE:
                                o.preventDefault(), s.restoreFocus = !0, n.$apply(e.cancel)
                        }
                    }), s.selectEl.on("keydown", function(e) {
                        switch (e.keyCode) {
                            case t.KEY_CODE.UP_ARROW:
                                return l();
                            case t.KEY_CODE.DOWN_ARROW:
                                return r();
                            default:
                                if (e.keyCode >= 31 && e.keyCode <= 90) {
                                    var n = s.selectEl.controller("mdSelectMenu").optNodeForKeyboardSearch(e);
                                    n && n.focus()
                                }
                        }
                    }), s.selectEl.on("click", d), s.selectEl.on("keydown", function(e) {
                        (32 == e.keyCode || 13 == e.keyCode) && d()
                    })
                }
            }
            if (!s.target) throw new Error('$mdSelect.show() expected a target element in options.target but got "' + s.target + '"!');
            angular.extend(s, {
                isRemoved: !1,
                target: angular.element(s.target),
                parent: angular.element(s.parent),
                selectEl: o.find("md-select-menu"),
                contentEl: o.find("md-content"),
                backdrop: s.hasBackdrop && angular.element('<md-backdrop class="md-select-backdrop md-click-catcher">')
            }), s.resizeFn = function() {
                a(function() {
                    a(function() {
                        m(n, o, s)
                    })
                })
            }, angular.element(d).on("resize", s.resizeFn), angular.element(d).on("orientationchange", s.resizeFn), c(), o.removeClass("md-leave");
            var p = s.selectEl[0].getElementsByTagName("md-option");
            return s.loadingAsync && s.loadingAsync.then ? s.loadingAsync.then(function() {
                n.$$loadingAsyncDone = !0, a(function() {
                    a(function() {
                        s.isRemoved || m(n, o, s)
                    })
                })
            }) : s.loadingAsync && (n.$$loadingAsyncDone = !0), s.disableParentScroll && !i.getClosest(s.target, "MD-DIALOG") ? s.restoreScroll = i.disableScrollAround(s.target) : s.disableParentScroll = !1, l(u, 75, !1), s.backdrop && (r.inherit(s.backdrop, s.parent), s.parent.append(s.backdrop)), s.parent.append(o), a(function() {
                a(function() {
                    s.isRemoved || m(n, o, s)
                })
            }), i.transitionEndPromise(s.selectEl, {
                timeout: 350
            })
        }

        function c(e, t, n) {
            n.isRemoved = !0, t.addClass("md-leave").removeClass("md-clickable"), n.target.attr("aria-expanded", "false"), angular.element(d).off("resize", n.resizefn), angular.element(d).off("orientationchange", n.resizefn), n.resizeFn = void 0;
            var o = n.selectEl.controller("mdSelect");
            return o && o.setLabelText(n.selectEl.controller("mdSelectMenu").selectedLabels()), i.transitionEndPromise(t, {
                timeout: 350
            }).then(function() {
                t.removeClass("md-active"), n.backdrop && n.backdrop.remove(), n.parent[0].removeChild(t[0]), n.disableParentScroll && n.restoreScroll(), n.restoreFocus && n.target.focus()
            })
        }

        function m(e, r, l) {
            var s, c = r[0],
                m = l.target[0],
                u = l.parent[0],
                p = l.selectEl[0],
                h = l.contentEl[0],
                f = u.getBoundingClientRect(),
                g = m.getBoundingClientRect(),
                b = !1,
                v = {
                    left: f.left + SELECT_EDGE_MARGIN,
                    top: SELECT_EDGE_MARGIN,
                    bottom: f.height - SELECT_EDGE_MARGIN,
                    right: f.width - SELECT_EDGE_MARGIN - (i.floatingScrollbars() ? 16 : 0)
                },
                E = {
                    top: g.top - v.top,
                    left: g.left - v.left,
                    right: v.right - (g.left + g.width),
                    bottom: v.bottom - (g.top + g.height)
                },
                M = f.width - 2 * SELECT_EDGE_MARGIN,
                y = h.scrollHeight > h.offsetHeight,
                C = p.querySelector("md-option[selected]"),
                T = p.getElementsByTagName("md-option"),
                $ = p.getElementsByTagName("md-optgroup");
            s = C ? C : $.length ? $[0] : T.length ? T[0] : h.firstElementChild || h, h.offsetWidth > M && (h.style["max-width"] = M + "px"), b && (h.style["min-width"] = g.width + "px"), y && p.classList.add("md-overflow");
            var x = p.getBoundingClientRect(),
                A = o(s);
            if (s) {
                var w = d.getComputedStyle(s);
                A.paddingLeft = parseInt(w.paddingLeft, 10) || 0, A.paddingRight = parseInt(w.paddingRight, 10) || 0
            }
            var k = s;
            if ("MD-OPTGROUP" === (k.tagName || "").toUpperCase() && (k = T[0] || h.firstElementChild || h), y) {
                var N = h.offsetHeight / 2;
                h.scrollTop = A.top + A.height / 2 - N, E.top < N ? h.scrollTop = Math.min(A.top, h.scrollTop + N - E.top) : E.bottom < N && (h.scrollTop = Math.max(A.top + A.height - x.height, h.scrollTop - N + E.bottom))
            }
            var S, _, D;
            b ? (S = g.left, _ = g.top + g.height, D = "50% 0", _ + x.height > v.bottom && (_ = g.top - x.height, D = "50% 100%")) : (S = g.left + A.left - A.paddingLeft, _ = g.top + g.height / 2 - A.height / 2 - A.top + h.scrollTop, D = A.left + g.width / 2 + "px " + (A.top + A.height / 2 - h.scrollTop) + "px 0px", c.style.minWidth = g.width + A.paddingLeft + A.paddingRight + "px");
            var H = c.getBoundingClientRect();
            c.style.left = n(v.left, S, v.right - H.width) + "px", c.style.top = n(v.top, _, v.bottom - H.height) + "px", p.style[t.CSS.TRANSFORM_ORIGIN] = D, p.style[t.CSS.TRANSFORM] = "scale(" + Math.min(g.width / x.width, 1) + "," + Math.min(g.height / x.height, 1) + ")", a(function() {
                r.addClass("md-active"), p.style[t.CSS.TRANSFORM] = "", k && (l.focusedNode = k, k.focus())
            })
        }
        return {
            parent: "body",
            onShow: s,
            onRemove: c,
            hasBackdrop: !0,
            disableParentScroll: !0,
            themable: !0
        }
    }

    function n(e, t, n) {
        return Math.max(e, Math.min(t, n))
    }

    function o(e) {
        return e ? {
            left: e.offsetLeft,
            top: e.offsetTop,
            width: e.offsetWidth,
            height: e.offsetHeight
        } : {
            left: 0,
            top: 0,
            width: 0,
            height: 0
        }
    }
    return t.$inject = ["$mdSelect", "$mdConstant", "$$rAF", "$mdUtil", "$mdTheming", "$timeout", "$window"], e("$mdSelect").setDefaults({
        methods: ["target"],
        options: t
    })
}

function nodesToArray(e) {
    for (var t = [], n = 0; n < e.length; ++n) t.push(e.item(n));
    return t
}

function SidenavService(e, t) {
    return function(n) {
        function o() {
            return e.when(n).then(function(e) {
                return r = e, e
            })
        }
        var a, i = "SideNav '" + n + "' is not available!",
            r = e.get(n);
        return r || e.notFoundError(n), a = {
            isOpen: function() {
                return r && r.isOpen()
            },
            isLockedOpen: function() {
                return r && r.isLockedOpen()
            },
            toggle: function() {
                return r ? r.toggle() : t.reject(i)
            },
            open: function() {
                return r ? r.open() : t.reject(i)
            },
            close: function() {
                return r ? r.close() : t.reject(i)
            },
            then: function(e) {
                var n = r ? t.when(r) : o();
                return n.then(e || angular.noop)
            }
        }
    }
}

function SidenavFocusDirective() {
    return {
        restrict: "A",
        require: "^mdSidenav",
        link: function(e, t, n, o) {
            o.focusElement(t)
        }
    }
}

function SidenavDirective(e, t, n, o, a, i, r, l, d, s) {
    function c(c, m, u, p) {
        function h(e, n) {
            c.isLockedOpen = e, e === n ? m.toggleClass("md-locked-open", !!e) : t[e ? "addClass" : "removeClass"](m, "md-locked-open"), x.toggleClass("md-locked-open", !!e)
        }

        function f(e) {
            var n = m.parent();
            n[e ? "on" : "off"]("keydown", v), x[e ? "on" : "off"]("click", E), e && (y = s[0].activeElement);
            var o = p.focusElement();
            return g(e), C = d.all([e ? t.enter(x, n) : t.leave(x), t[e ? "removeClass" : "addClass"](m, "md-closed")]).then(function() {
                c.isOpen && o && o.focus()
            })
        }

        function g(e) {
            var t = m.parent();
            e ? (M = t.css("overflow"), t.css("overflow", "hidden")) : angular.isDefined(M) && (t.css("overflow", M), M = void 0)
        }

        function b(t) {
            if (c.isOpen == t) return d.when(!0);
            var n = d.defer();
            return c.isOpen = t, e(function() {
                C.then(function(e) {
                    c.isOpen || (y && y.focus(), y = null), n.resolve(e)
                })
            }, 0, !1), n.promise
        }

        function v(e) {
            var t = e.keyCode === i.KEY_CODE.ESCAPE;
            return t ? E(e) : d.when(!0)
        }

        function E(e) {
            return e.preventDefault(), e.stopPropagation(), p.close()
        }
        var M, y = null,
            C = d.when(!0),
            T = n(u.mdIsLockedOpen),
            $ = function() {
                return T(c.$parent, {
                    $media: function(e) {
                        return o.warn("$media is deprecated for is-locked-open. Use $mdMedia instead."), a(e)
                    },
                    $mdMedia: a
                })
            },
            x = r('<md-backdrop class="md-sidenav-backdrop md-opaque ng-enter">')(c);
        m.on("$destroy", p.destroy), l.inherit(x, m), c.$watch($, h), c.$watch("isOpen", f), p.$toggleOpen = b, p.focusElement(p.focusElement() || m)
    }
    return {
        restrict: "E",
        scope: {
            isOpen: "=?mdIsOpen"
        },
        controller: "$mdSidenavController",
        compile: function(e) {
            return e.addClass("md-closed"), e.attr("tabIndex", "-1"), c
        }
    }
}

function SidenavController(e, t, n, o, a) {
    var i, r = this;
    r.isOpen = function() {
        return !!e.isOpen
    }, r.isLockedOpen = function() {
        return !!e.isLockedOpen
    }, r.open = function() {
        return r.$toggleOpen(!0)
    }, r.close = function() {
        return r.$toggleOpen(!1)
    }, r.toggle = function() {
        return r.$toggleOpen(!e.isOpen)
    }, r.focusElement = function(e) {
        return angular.isDefined(e) && (i = e), i
    }, r.$toggleOpen = function() {
        return a.when(e.isOpen)
    }, r.destroy = o.register(r, n.mdComponentId)
}

function SliderDirective(e, t, n, o, a, i, r, l) {
    function d(e, t) {
        return e.attr({
            tabIndex: 0,
            role: "slider"
        }), n.expect(e, "aria-label"), s
    }

    function s(n, d, s, c) {
        function m() {
            b(), y(), g()
        }

        function u(e) {
            W = parseFloat(e), d.attr("aria-valuemin", e), m()
        }

        function p(e) {
            K = parseFloat(e), d.attr("aria-valuemax", e), m()
        }

        function h(e) {
            Y = parseFloat(e), g()
        }

        function f(e) {
            d.attr("aria-disabled", !!e)
        }

        function g() {
            if (angular.isDefined(s.mdDiscrete)) {
                var e = Math.floor((K - W) / Y);
                if (!X) {
                    var n = t.getComputedStyle(G[0]);
                    X = angular.element('<canvas style="position:absolute;">'), Z = X[0].getContext("2d"), Z.fillStyle = n.backgroundColor || "black", G.append(X)
                }
                var o = v();
                X[0].width = o.width, X[0].height = o.height;
                for (var a, i = 0; e >= i; i++) a = Math.floor(o.width * (i / e)), Z.fillRect(a - 1, 0, 2, o.height)
            }
        }

        function b() {
            Q = R[0].getBoundingClientRect()
        }

        function v() {
            return q(), Q
        }

        function E(e) {
            if (!d[0].hasAttribute("disabled")) {
                var t;
                e.keyCode === a.KEY_CODE.LEFT_ARROW ? t = -Y : e.keyCode === a.KEY_CODE.RIGHT_ARROW && (t = Y), t && ((e.metaKey || e.ctrlKey || e.altKey) && (t *= 4), e.preventDefault(), e.stopPropagation(), n.$evalAsync(function() {
                    M(c.$viewValue + t)
                }))
            }
        }

        function M(e) {
            c.$setViewValue(C(T(e)))
        }

        function y() {
            isNaN(c.$viewValue) && (c.$viewValue = c.$modelValue);
            var e = (c.$viewValue - W) / (K - W);
            n.modelValue = c.$viewValue, d.attr("aria-valuenow", c.$viewValue), $(e), U.text(c.$viewValue)
        }

        function C(e) {
            return angular.isNumber(e) ? Math.max(W, Math.min(K, e)) : void 0
        }

        function T(e) {
            return angular.isNumber(e) ? Math.round(e / Y) * Y : void 0
        }

        function $(e) {
            F.css("width", 100 * e + "%"), O.css("left", 100 * e + "%"), d.toggleClass("md-min", 0 === e)
        }

        function x(e) {
            if (!L()) {
                d.addClass("active"), d[0].focus(), b();
                var t = P(H(e.pointer.x)),
                    o = C(T(t));
                n.$apply(function() {
                    M(o), $(j(o))
                })
            }
        }

        function A(e) {
            if (!L()) {
                d.removeClass("dragging active");
                var t = P(H(e.pointer.x)),
                    o = C(T(t));
                n.$apply(function() {
                    M(o), y()
                })
            }
        }

        function w(e) {
            L() || (J = !0, e.stopPropagation(), d.addClass("dragging"), S(e))
        }

        function k(e) {
            J && (e.stopPropagation(), S(e))
        }

        function N(e) {
            J && (e.stopPropagation(), J = !1)
        }

        function S(e) {
            ee ? D(e.pointer.x) : _(e.pointer.x)
        }

        function _(e) {
            n.$evalAsync(function() {
                M(P(H(e)))
            })
        }

        function D(e) {
            var t = P(H(e)),
                n = C(T(t));
            $(H(e)), U.text(n)
        }

        function H(e) {
            return Math.max(0, Math.min(1, (e - Q.left) / Q.width))
        }

        function P(e) {
            return W + e * (K - W)
        }

        function j(e) {
            return (e - W) / (K - W)
        }
        i(d), c = c || {
            $setViewValue: function(e) {
                this.$viewValue = e, this.$viewChangeListeners.forEach(function(e) {
                    e()
                })
            },
            $parsers: [],
            $formatters: [],
            $viewChangeListeners: []
        };
        var I = s.ngDisabled && l(s.ngDisabled),
            L = I ? function() {
                return I(n.$parent)
            } : angular.noop,
            B = angular.element(d[0].querySelector(".md-thumb")),
            U = angular.element(d[0].querySelector(".md-thumb-text")),
            O = B.parent(),
            R = angular.element(d[0].querySelector(".md-track-container")),
            F = angular.element(d[0].querySelector(".md-track-fill")),
            G = angular.element(d[0].querySelector(".md-track-ticks")),
            q = o.throttle(b, 5e3);
        s.min ? s.$observe("min", u) : u(0), s.max ? s.$observe("max", p) : p(100), s.step ? s.$observe("step", h) : h(1);
        var V = angular.noop;
        s.ngDisabled && (V = n.$parent.$watch(s.ngDisabled, f)), r.register(d, "drag"), d.on("keydown", E).on("$md.pressdown", x).on("$md.pressup", A).on("$md.dragstart", w).on("$md.drag", k).on("$md.dragend", N), setTimeout(m);
        var z = e.throttle(m);
        angular.element(t).on("resize", z), n.$on("$destroy", function() {
            angular.element(t).off("resize", z), V()
        }), c.$render = y, c.$viewChangeListeners.push(y), c.$formatters.push(C), c.$formatters.push(T);
        var W, K, Y, X, Z, Q = {};
        b();
        var J = !1,
            ee = angular.isDefined(s.mdDiscrete)
    }
    return {
        scope: {},
        require: "?ngModel",
        template: '<div class="md-slider-wrapper">        <div class="md-track-container">          <div class="md-track"></div>          <div class="md-track md-track-fill"></div>          <div class="md-track-ticks"></div>        </div>        <div class="md-thumb-container">          <div class="md-thumb"></div>          <div class="md-focus-thumb"></div>          <div class="md-focus-ring"></div>          <div class="md-sign">            <span class="md-thumb-text"></span>          </div>          <div class="md-disabled-thumb"></div>        </div>      </div>',
        compile: d
    }
}

function MdSticky(e, t, n, o, a) {
    function i(e) {
        function n(e, t) {
            t.addClass("md-sticky-clone"), t.css("top", h + "px");
            var n = {
                element: e,
                clone: t
            };
            return p.items.push(n), m.parent().prepend(n.clone), u(),
                function() {
                    p.items.forEach(function(t, n) {
                        t.element[0] === e[0] && (p.items.splice(n, 1), t.clone.remove())
                    }), u()
                }
        }

        function a() {
            p.items.forEach(i), p.items = p.items.sort(function(e, t) {
                return e.top < t.top ? -1 : 1
            });
            for (var e, t = m.prop("scrollTop"), n = p.items.length - 1; n >= 0; n--)
                if (t > p.items[n].top) {
                    e = p.items[n];
                    break
                }
            d(e)
        }

        function i(e) {
            var t = e.element[0];
            for (e.top = 0, e.left = 0; t && t !== m[0];) e.top += t.offsetTop, e.left += t.offsetLeft, t = t.offsetParent;
            e.height = e.element.prop("offsetHeight"), e.clone.css("margin-left", e.left + "px")
        }

        function r() {
            var e = m.prop("scrollTop"),
                t = e > (r.prevScrollTop || 0);
            r.prevScrollTop = e, 0 === e ? d(null) : t && p.next ? p.next.top - e <= 0 ? d(p.next) : p.current && (p.next.top - e <= p.next.height ? c(p.current, p.next.top - p.next.height - e) : c(p.current, null)) : !t && p.current && (e < p.current.top && d(p.prev), p.current && p.next && (e >= p.next.top - p.current.height ? c(p.current, p.next.top - e - p.current.height) : c(p.current, null)))
        }

        function d(e) {
            if (p.current !== e) {
                p.current && (c(p.current, null), s(p.current, null)), e && s(e, "active"), p.current = e;
                var t = p.items.indexOf(e);
                p.next = p.items[t + 1], p.prev = p.items[t - 1], s(p.next, "next"), s(p.prev, "prev")
            }
        }

        function s(e, t) {
            e && e.state !== t && (e.state && (e.clone.attr("sticky-prev-state", e.state), e.element.attr("sticky-prev-state", e.state)), e.clone.attr("sticky-state", t), e.element.attr("sticky-state", t), e.state = t)
        }

        function c(e, n) {
            e && (null === n || void 0 === n ? e.translateY && (e.translateY = null, e.clone.css(t.CSS.TRANSFORM, "")) : (e.translateY = n, e.clone.css(t.CSS.TRANSFORM, "translate3d(" + e.left + "px," + n + "px,0)")))
        }
        var m = e.$element,
            u = o.throttle(a);
        l(m), m.on("$scrollstart", u), m.on("$scroll", r);
        var p, h = m.prop("offsetTop");
        return p = {
            prev: null,
            current: null,
            next: null,
            items: [],
            add: n,
            refreshElements: a
        }
    }

    function r(t) {
        var n, o = angular.element("<div>");
        e[0].body.appendChild(o[0]);
        for (var a = ["sticky", "-webkit-sticky"], i = 0; i < a.length; ++i)
            if (o.css({
                    position: a[i],
                    top: 0,
                    "z-index": 2
                }), o.css("position") == a[i]) {
                n = a[i];
                break
            }
        return o.remove(), n
    }

    function l(e) {
        function t() {
            +a.now() - i > r ? (n = !1, e.triggerHandler("$scrollend")) : (e.triggerHandler("$scroll"), o(t))
        }
        var n, i, r = 200;
        e.on("scroll touchmove", function() {
            n || (n = !0, o(t), e.triggerHandler("$scrollstart")), e.triggerHandler("$scroll"), i = +a.now()
        })
    }
    var d = r();
    return function(e, t, n) {
        var o = t.controller("mdContent");
        if (o)
            if (d) t.css({
                position: d,
                top: 0,
                "z-index": 2
            });
            else {
                var a = o.$element.data("$$sticky");
                a || (a = i(o), o.$element.data("$$sticky", a));
                var r = a.add(t, n || t.clone());
                e.$on("$destroy", r)
            }
    }
}

function MdSubheaderDirective(e, t, n) {
    return {
        restrict: "E",
        replace: !0,
        transclude: !0,
        template: '<h2 class="md-subheader"><div class="md-subheader-inner"><span class="md-subheader-content"></span></div></h2>',
        compile: function(o, a, i) {
            var r = o[0].outerHTML;
            return function(o, a, l) {
                function d(e) {
                    return angular.element(e[0].querySelector(".md-subheader-content"))
                }
                n(a), i(o, function(e) {
                    d(a).append(e)
                }), a.hasClass("md-no-sticky") || i(o, function(i) {
                    var l = t(angular.element(r))(o);
                    n(l), d(l).append(i), e(o, a, l)
                })
            }
        }
    }
}

function getDirective(e) {
    var t = "md" + e,
        n = "$md." + e.toLowerCase();
    return function(e) {
        function o(o, a, i) {
            var r = e(i[t]);
            a.on(n, function(e) {
                o.$apply(function() {
                    r(o, {
                        $event: e
                    })
                })
            })
        }
        return {
            restrict: "A",
            link: o
        }
    }
}

function MdSwitch(e, t, n, o, a, i, r, l) {
    function d(e, t) {
        var o = s.compile(e, t);
        return e.addClass("md-dragging"),
            function(e, t, d, s) {
                function c(n) {
                    h(e) || (n.stopPropagation(), t.addClass("md-dragging"), b = {
                        width: f.prop("offsetWidth")
                    }, t.removeClass("transition"))
                }

                function m(e) {
                    if (b) {
                        e.stopPropagation(), e.srcEvent && e.srcEvent.preventDefault();
                        var t = e.pointer.distanceX / b.width,
                            n = s.$viewValue ? 1 + t : t;
                        n = Math.max(0, Math.min(1, n)), f.css(a.CSS.TRANSFORM, "translate3d(" + 100 * n + "%,0,0)"), b.translate = n
                    }
                }

                function u(e) {
                    if (b) {
                        e.stopPropagation(), t.removeClass("md-dragging"), f.css(a.CSS.TRANSFORM, "");
                        var n = s.$viewValue ? b.translate < .5 : b.translate > .5;
                        n && p(!s.$viewValue), b = null
                    }
                }

                function p(t) {
                    e.$apply(function() {
                        s.$setViewValue(t), s.$render()
                    })
                }
                s = s || n.fakeNgModel();
                var h = i(d.ngDisabled),
                    f = angular.element(t[0].querySelector(".md-thumb-container")),
                    g = angular.element(t[0].querySelector(".md-container"));
                r(function() {
                    t.removeClass("md-dragging")
                }), o(e, t, d, s), angular.isDefined(d.ngDisabled) && e.$watch(h, function(e) {
                    t.attr("tabindex", e ? -1 : 0)
                }), l.register(g, "drag"), g.on("$md.dragstart", c).on("$md.drag", m).on("$md.dragend", u);
                var b
            }
    }
    var s = e[0];
    return {
        restrict: "E",
        transclude: !0,
        template: '<div class="md-container"><div class="md-bar"></div><div class="md-thumb-container"><div class="md-thumb" md-ink-ripple md-ink-ripple-checkbox></div></div></div><div ng-transclude class="md-label"></div>',
        require: "?ngModel",
        compile: d
    }
}

function MdToastDirective() {
    return {
        restrict: "E"
    }
}

function MdToastProvider(e) {
    function t(e, t, o, a) {
        function i(i, r, d) {
            return r = a.extractElementByName(r, "md-toast"), n = d.content, r.addClass(d.position.split(" ").map(function(e) {
                return "md-" + e
            }).join(" ")), d.parent.addClass(l(d.position)), d.onSwipe = function(t, n) {
                r.addClass("md-" + t.type.replace("$md.", "")), e(o.cancel)
            }, r.on("$md.swipeleft $md.swiperight", d.onSwipe), t.enter(r, d.parent)
        }

        function r(e, n, o) {
            return n.off("$md.swipeleft $md.swiperight", o.onSwipe), o.parent.removeClass(l(o.position)), t.leave(n)
        }

        function l(e) {
            return "md-toast-open-" + (e.indexOf("top") > -1 ? "top" : "bottom")
        }
        return {
            onShow: i,
            onRemove: r,
            position: "bottom left",
            themable: !0,
            hideDelay: 3e3
        }
    }
    var n, o = e("$mdToast").setDefaults({
        methods: ["position", "hideDelay", "capsule"],
        options: t
    }).addPreset("simple", {
        argOption: "content",
        methods: ["content", "action", "highlightAction", "theme", "parent"],
        options: ["$mdToast", "$mdTheming", function(e, t) {
            var o = {
                template: ['<md-toast md-theme="{{ toast.theme }}" ng-class="{\'md-capsule\': toast.capsule}">', "<span flex>{{ toast.content }}</span>", '<md-button class="md-action" ng-if="toast.action" ng-click="toast.resolve()" ng-class="{\'md-highlight\': toast.highlightAction}">', "{{ toast.action }}", "</md-button>", "</md-toast>"].join(""),
                controller: ["$scope", function(t) {
                    var o = this;
                    t.$watch(function() {
                        return n
                    }, function() {
                        o.content = n
                    }), this.resolve = function() {
                        e.hide()
                    }
                }],
                theme: t.defaultTheme(),
                controllerAs: "toast",
                bindToController: !0
            };
            return o
        }]
    }).addMethod("updateContent", function(e) {
        n = e
    });
    return t.$inject = ["$timeout", "$animate", "$mdToast", "$mdUtil"], o
}

function mdToolbarDirective(e, t, n, o) {
    return {
        restrict: "E",
        controller: angular.noop,
        link: function(a, i, r) {
            function l() {
                function o(t, n) {
                    i.parent()[0] === n.parent()[0] && (c && c.off("scroll", h), n.on("scroll", h), n.attr("scroll-shrink", "true"), c = n, e(l))
                }

                function l() {
                    s = i.prop("offsetHeight"), c.css("margin-top", -s * p + "px"), d()
                }

                function d(e) {
                    var n = e ? e.target.scrollTop : u;
                    f(), m = Math.min(s / p, Math.max(0, m + n - u)), i.css(t.CSS.TRANSFORM, "translate3d(0," + -m * p + "px,0)"), c.css(t.CSS.TRANSFORM, "translate3d(0," + (s - m) * p + "px,0)"), u = n
                }
                var s, c, m = 0,
                    u = 0,
                    p = r.mdShrinkSpeedFactor || .5,
                    h = e.throttle(d),
                    f = n.debounce(l, 5e3);
                a.$on("$mdContentLoaded", o)
            }
            o(i), angular.isDefined(r.mdScrollShrink) && l()
        }
    }
}

function MdTooltipDirective(e, t, n, o, a, i, r, l, d) {
    function s(s, u, p) {
        function h() {
            f(), b(), M(), g()
        }

        function f() {
            angular.isDefined(p.mdDelay) || (s.delay = c)
        }

        function g() {
            s.$watch("visible", function(e) {
                e ? C() : T()
            }), s.$on("$destroy", function() {
                s.visible = !1, u.remove(), angular.element(t).off("resize", _)
            })
        }

        function b() {
            u.detach(), u.attr("role", "tooltip"), u.attr("id", p.id || "tooltip_" + a.nextUid())
        }

        function v() {
            for (var e = u.parent();
                "none" == t.getComputedStyle(e[0])["pointer-events"];) e = e.parent();
            return e
        }

        function E() {
            for (var e = u.parent()[0]; e && e !== r[0] && e !== document.body && (!e.tagName || "md-content" != e.tagName.toLowerCase());) e = e.parentNode;
            return e
        }

        function M() {
            var e = s.hasOwnProperty("autohide") ? s.autohide : p.hasOwnProperty("mdAutohide");
            x.on("focus mouseenter touchstart", function() {
                y(!0)
            }), x.on("blur mouseleave touchend touchcancel", function() {
                (o[0].activeElement !== x[0] || e) && y(!1)
            }), angular.element(t).on("resize", _)
        }

        function y(t) {
            y.value = !!t, y.queued || (t ? (y.queued = !0, e(function() {
                s.visible = y.value, y.queued = !1
            }, s.delay)) : e(function() {
                s.visible = !1
            }))
        }

        function C() {
            S.append(u);
            var e = t.getComputedStyle(u[0]);
            return angular.isDefined(e.display) && "none" == e.display ? void u.detach() : (x.attr("aria-describedby", u.attr("id")), $(), void angular.forEach([u, A, w], function(e) {
                l.addClass(e, "md-show")
            }))
        }

        function T() {
            x.removeAttr("aria-describedby"), d.all([l.removeClass(w, "md-show"), l.removeClass(A, "md-show"), l.removeClass(u, "md-show")]).then(function() {
                s.visible || u.detach()
            })
        }

        function $() {
            function e() {
                var e = "left" === k || "right" === k ? 2 * Math.sqrt(Math.pow(o.width, 2) + Math.pow(o.height / 2, 2)) : 2 * Math.sqrt(Math.pow(o.width / 2, 2) + Math.pow(o.height, 2)),
                    t = "left" === k ? {
                        left: 100,
                        top: 50
                    } : "right" === k ? {
                        left: 0,
                        top: 50
                    } : "top" === k ? {
                        left: 50,
                        top: 100
                    } : {
                        left: 50,
                        top: 0
                    };
                A.css({
                    width: e + "px",
                    height: e + "px",
                    left: t.left + "%",
                    top: t.top + "%"
                })
            }

            function t(e) {
                var t = {
                    left: e.left,
                    top: e.top
                };
                return t.left = Math.min(t.left, S.prop("scrollWidth") - o.width - m), t.left = Math.max(t.left, m), t.top = Math.min(t.top, S.prop("scrollHeight") - o.height - m), t.top = Math.max(t.top, m), t
            }

            function n(e) {
                return "left" === e ? {
                    left: i.left - o.width - m,
                    top: i.top + i.height / 2 - o.height / 2
                } : "right" === e ? {
                    left: i.left + i.width + m,
                    top: i.top + i.height / 2 - o.height / 2
                } : "top" === e ? {
                    left: i.left + i.width / 2 - o.width / 2,
                    top: i.top - o.height - m
                } : {
                    left: i.left + i.width / 2 - o.width / 2,
                    top: i.top + i.height + m
                }
            }
            var o = a.offsetRect(u, S),
                i = a.offsetRect(x, S),
                r = n(k);
            k ? r = t(r) : r.top > u.prop("offsetParent").scrollHeight - o.height - m && (r = t(n("top"))), u.css({
                top: r.top + "px",
                left: r.left + "px"
            }), e()
        }
        i(u);
        var x = v(),
            A = angular.element(u[0].getElementsByClassName("md-background")[0]),
            w = angular.element(u[0].getElementsByClassName("md-content")[0]),
            k = p.mdDirection,
            N = E(),
            S = angular.element(N || document.body),
            _ = n.throttle(function() {
                s.visible && $()
            });
        return h()
    }
    var c = 300,
        m = 8;
    return {
        restrict: "E",
        transclude: !0,
        template: '        <div class="md-background"></div>        <div class="md-content" ng-transclude></div>',
        scope: {
            visible: "=?mdVisible",
            delay: "=?mdDelay",
            autohide: "=?mdAutohide"
        },
        link: s
    }
}

function MdAutocompleteCtrl(e, t, n, o, a, i, r, l) {
    function d() {
        u(), a(function() {
            p(), m(), c()
        })
    }

    function s() {
        function e() {
            var e = R.ul.getBoundingClientRect(),
                n = {};
            e.right > o.right - MENU_PADDING && (n.left = t.right - e.width + "px"), R.$.ul.css(n)
        }
        if (!R) return a(s, 0, !1);
        var t = R.wrap.getBoundingClientRect(),
            n = R.snap.getBoundingClientRect(),
            o = R.root.getBoundingClientRect(),
            i = n.bottom - o.top,
            r = o.bottom - n.top,
            l = t.left - o.left,
            d = t.width,
            c = {
                left: l + "px",
                minWidth: d + "px",
                maxWidth: Math.max(t.right - o.left, o.right - t.left) - MENU_PADDING + "px"
            };
        i > r && o.height - t.bottom - MENU_PADDING < MAX_HEIGHT ? (c.top = "auto", c.bottom = r + "px", c.maxHeight = Math.min(MAX_HEIGHT, t.top - o.top - MENU_PADDING) + "px") : (c.top = i + "px", c.bottom = "auto", c.maxHeight = Math.min(MAX_HEIGHT, o.bottom - t.bottom - MENU_PADDING) + "px"), R.$.ul.css(c), a(e, 0, !1)
    }

    function c() {
        R.$.root.length && (i(R.$.ul), R.$.ul.detach(), R.$.root.append(R.$.ul))
    }

    function m() {
        e.autofocus && R.input.focus()
    }

    function u() {
        var t = parseInt(e.delay, 10) || 0;
        e.$watch("searchText", t ? n.debounce(M, t) : M), v(g), e.$watch("selectedItem", b), e.$watch("$mdAutocompleteCtrl.hidden", function(e, t) {
            !e && t && s()
        }), angular.element(r).on("resize", s)
    }

    function p() {
        R = {
            main: t[0],
            ul: t.find("ul")[0],
            input: t.find("input")[0],
            wrap: t.find("md-autocomplete-wrap")[0],
            root: document.body
        }, R.snap = h(), R.$ = f(R)
    }

    function h() {
        for (var e = t; e.length; e = e.parent())
            if (angular.isDefined(e.attr("md-autocomplete-snap"))) return e[0];
        return R.wrap
    }

    function f(e) {
        var t = {};
        for (var n in e) t[n] = angular.element(e[n]);
        return t
    }

    function g(t, n) {
        t && (e.searchText = x(t)), e.itemChange && t !== n && e.itemChange(A(t))
    }

    function b(e, t) {
        for (var n = 0; n < V.length; ++n) V[n](e, t)
    }

    function v(e) {
        -1 == V.indexOf(e) && V.push(e)
    }

    function E(e) {
        var t = V.indexOf(e); - 1 != t && V.splice(t, 1)
    }

    function M(t, n) {
        B.index = w(), (t || t !== n) && t !== x(e.selectedItem) && (e.selectedItem = null, e.textChange && t !== n && e.textChange(A(e.selectedItem)), S() ? L() : (B.loading = !1, B.matches = [], B.hidden = k(), P()))
    }

    function y() {
        z = !1, q || (B.hidden = !0)
    }

    function C() {
        z = !0, angular.isString(e.searchText) || (e.searchText = ""), e.minLength > 0 || (B.hidden = k(), B.hidden || L())
    }

    function T(e) {
        switch (e.keyCode) {
            case o.KEY_CODE.DOWN_ARROW:
                if (B.loading) return;
                e.preventDefault(), B.index = Math.min(B.index + 1, B.matches.length - 1), I(), j();
                break;
            case o.KEY_CODE.UP_ARROW:
                if (B.loading) return;
                e.preventDefault(), B.index = B.index < 0 ? B.matches.length - 1 : Math.max(0, B.index - 1), I(), j();
                break;
            case o.KEY_CODE.ENTER:
                if (B.hidden || B.loading || B.index < 0) return;
                e.preventDefault(), _(B.index);
                break;
            case o.KEY_CODE.ESCAPE:
                B.matches = [], B.hidden = !0, B.index = w();
                break;
            case o.KEY_CODE.TAB:
        }
    }

    function $() {
        return angular.isNumber(e.minLength) ? e.minLength : 1
    }

    function x(t) {
        return t && e.itemText ? e.itemText(A(t)) : t
    }

    function A(e) {
        if (e) {
            var t = {};
            return B.itemName && (t[B.itemName] = e), t
        }
    }

    function w() {
        return e.autoselect ? 0 : -1
    }

    function k() {
        return S() ? void 0 : !0
    }

    function N() {
        return x(B.matches[B.index])
    }

    function S() {
        return e.searchText.length >= $()
    }

    function _(t) {
        e.selectedItem = B.matches[t], e.searchText = x(e.selectedItem) || e.searchText, B.hidden = !0, B.index = 0, B.matches = []
    }

    function D() {
        e.searchText = "", _(-1), R.input.focus()
    }

    function H(t) {
        function n(n) {
            G[a] = n, t === e.searchText && (F = null, B.loading = !1, B.matches = n, B.hidden = k(), P(), s())
        }
        var o = e.$parent.$eval(O),
            a = t.toLowerCase();
        angular.isArray(o) ? n(o) : (B.loading = !0, o.success && o.success(n), o.then && o.then(n), o.error && o.error(function() {
            B.loading = !1
        }))
    }

    function P() {
        if (!B.hidden) switch (B.matches.length) {
            case 0:
                return B.messages.splice(0);
            case 1:
                return B.messages.push({
                    display: "There is 1 match available."
                });
            default:
                return B.messages.push({
                    display: "There are " + B.matches.length + " matches available."
                })
        }
    }

    function j() {
        B.messages.push({
            display: N()
        })
    }

    function I() {
        var e = ITEM_HEIGHT * B.index,
            t = e + ITEM_HEIGHT,
            n = R.ul.clientHeight;
        e < R.ul.scrollTop ? R.ul.scrollTop = e : t > R.ul.scrollTop + n && (R.ul.scrollTop = t - n)
    }

    function L() {
        var t = e.searchText,
            n = t.toLowerCase();
        F && F.cancel && (F.cancel(), F = null), !e.noCache && G[n] ? (B.matches = G[n], P()) : H(t), B.hidden = k()
    }
    var B = this,
        U = e.itemsExpr.split(/ in /i),
        O = U[1],
        R = null,
        F = null,
        G = {},
        q = !1,
        V = [],
        z = !1;
    return B.scope = e, B.parent = e.$parent, B.itemName = U[0], B.matches = [], B.loading = !1, B.hidden = !0, B.index = null, B.messages = [], B.id = n.nextUid(), B.keydown = T, B.blur = y, B.focus = C, B.clear = D, B.select = _, B.getCurrentDisplayValue = N, B.registerSelectedItemWatcher = v, B.unregisterSelectedItemWatcher = E, B.listEnter = function() {
        q = !0
    }, B.listLeave = function() {
        q = !1, z || (B.hidden = !0)
    }, B.mouseUp = function() {
        R.input.focus()
    }, d()
}

function MdAutocomplete(e) {
    function t(t, n, o) {
        t.contents = o.$mdAutocompleteTemplate, delete o.$mdAutocompleteTemplate, angular.forEach(t.$$isolateBindings, function(e, n) {
            e.optional && angular.isUndefined(t[n]) && (t[n] = o.hasOwnProperty(o.$normalize(e.attrName)))
        }), e(n)
    }
    return {
        controller: "MdAutocompleteCtrl",
        controllerAs: "$mdAutocompleteCtrl",
        link: t,
        scope: {
            name: "@",
            searchText: "=?mdSearchText",
            selectedItem: "=?mdSelectedItem",
            itemsExpr: "@mdItems",
            itemText: "&mdItemText",
            placeholder: "@placeholder",
            noCache: "=?mdNoCache",
            itemChange: "&?mdSelectedItemChange",
            textChange: "&?mdSearchTextChange",
            isDisabled: "=?ngDisabled",
            minLength: "=?mdMinLength",
            delay: "=?mdDelay",
            autofocus: "=?mdAutofocus",
            floatingLabel: "@?mdFloatingLabel",
            autoselect: "=?mdAutoselect",
            menuClass: "@?mdMenuClass"
        },
        template: function(e, t) {
            return t.$mdAutocompleteTemplate = e.html(), '        <md-autocomplete-wrap role="listbox">          <md-input-container ng-if="floatingLabel">            <label>{{floatingLabel}}</label>            <input type="text"                id="fl-input-{{$mdAutocompleteCtrl.id}}"                name="{{name}}"                autocomplete="off"                ng-disabled="isDisabled"                ng-model="$mdAutocompleteCtrl.scope.searchText"                ng-keydown="$mdAutocompleteCtrl.keydown($event)"                ng-blur="$mdAutocompleteCtrl.blur()"                ng-focus="$mdAutocompleteCtrl.focus()"                aria-owns="ul-{{$mdAutocompleteCtrl.id}}"                aria-label="{{floatingLabel}}"                aria-autocomplete="list"                aria-haspopup="true"                aria-activedescendant=""                aria-expanded="{{!$mdAutocompleteCtrl.hidden}}"/>                        </md-input-container>          <input type="text"              id="input-{{$mdAutocompleteCtrl.id}}"              name="{{name}}"              ng-if="!floatingLabel"              autocomplete="off"              ng-disabled="isDisabled"              ng-model="$mdAutocompleteCtrl.scope.searchText"              ng-keydown="$mdAutocompleteCtrl.keydown($event)"              ng-blur="$mdAutocompleteCtrl.blur()"              ng-focus="$mdAutocompleteCtrl.focus()"              placeholder="{{placeholder}}"              aria-owns="ul-{{$mdAutocompleteCtrl.id}}"              aria-label="{{placeholder}}"              aria-autocomplete="list"              aria-haspopup="true"              aria-activedescendant=""              aria-expanded="{{!$mdAutocompleteCtrl.hidden}}"/>          <button              type="button"              tabindex="-1"              ng-if="$mdAutocompleteCtrl.scope.searchText && !isDisabled"              ng-click="$mdAutocompleteCtrl.clear()">            <md-icon md-svg-icon="cancel"></md-icon>            <span class="md-visually-hidden">Clear</span>          </button>          <md-progress-linear              ng-if="$mdAutocompleteCtrl.loading"              md-mode="indeterminate"></md-progress-linear>          <ul role="presentation"              class="md-autocomplete-suggestions {{menuClass || \'\'}}"              id="ul-{{$mdAutocompleteCtrl.id}}"              ng-mouseenter="$mdAutocompleteCtrl.listEnter()"              ng-mouseleave="$mdAutocompleteCtrl.listLeave()"              ng-mouseup="$mdAutocompleteCtrl.mouseUp()">            <li ng-repeat="(index, item) in $mdAutocompleteCtrl.matches"                ng-class="{ selected: index === $mdAutocompleteCtrl.index }"                ng-hide="$mdAutocompleteCtrl.hidden"                ng-click="$mdAutocompleteCtrl.select(index)"                md-autocomplete-list-item-template="contents"                md-autocomplete-list-item="$mdAutocompleteCtrl.itemName">            </li>          </ul>        </md-autocomplete-wrap>        <aria-status            class="md-visually-hidden"            role="status"            aria-live="assertive">          <p ng-repeat="message in $mdAutocompleteCtrl.messages">{{message.display}}</p>        </aria-status>'
        }
    }
}

function MdHighlightCtrl(e, t, n) {
    function o(e) {
        return e ? e.replace(/[\*\[\]\(\)\{\}\\\^\$]/g, "\\$&") : e
    }

    function a(e, t) {
        var n = "";
        return t.indexOf("^") >= 1 && (n += "^"), n += e, t.indexOf("$") >= 1 && (n += "$"), new RegExp(o(n), t.replace(/[\$\^]/g, ""))
    }
    var i = t.attr("md-highlight-text"),
        r = n(t.text())(e),
        l = t.attr("md-highlight-flags") || "",
        d = e.$watch(i, function(e) {
            var n = a(e, l),
                o = r.replace(n, '<span class="highlight">$&</span>');
            t.html(o)
        });
    t.on("$destroy", function() {
        d()
    })
}

function MdHighlight() {
    return {
        terminal: !0,
        scope: !1,
        controller: "MdHighlightCtrl"
    }
}

function MdAutocompleteListItem(e, t) {
    function n(n, o, a) {
        var i = n.$parent.$mdAutocompleteCtrl,
            r = i.parent.$new(!1, i.parent),
            l = i.scope.$eval(a.mdAutocompleteListItem);
        r[l] = n.item, o.html(i.scope.$eval(a.mdAutocompleteListItemTemplate)), e(o.contents())(r),
            o.attr({
                role: "option",
                id: "item_" + t.nextUid()
            })
    }
    return {
        terminal: !0,
        link: n,
        scope: !1
    }
}

function MdChip(e) {
    function t(t, n) {
        return t.append(DELETE_HINT_TEMPLATE),
            function(t, n, o, a) {
                a && angular.element(n[0].querySelector(".md-chip-content")).on("blur", function() {
                    a.$scope.$apply(function() {
                        a.selectedChip = -1
                    })
                }), n.addClass("md-chip"), e(n)
            }
    }
    return {
        restrict: "E",
        require: "^?mdChips",
        compile: t
    }
}

function MdChipRemove(e) {
    function t(t, n, o, a) {
        n.on("click", function(e) {
            t.$apply(function() {
                a.removeChip(t.$$replacedScope.$index)
            })
        }), e(function() {
            n.attr({
                tabindex: -1,
                ariaHidden: !0
            }), n.find("button").attr("tabindex", "-1")
        })
    }
    return {
        restrict: "A",
        require: "^mdChips",
        scope: !1,
        link: t
    }
}

function MdChipTransclude(e, t) {
    function n(t, n, o) {
        var a = t.$parent.$mdChipsCtrl,
            i = a.parent.$new(!1, a.parent);
        i.$$replacedScope = t, i.$chip = t.$chip, i.$mdChipsCtrl = a, n.html(a.$scope.$eval(o.mdChipTransclude)), e(n.contents())(i)
    }
    return {
        restrict: "EA",
        terminal: !0,
        link: n,
        scope: !1
    }
}

function MdChipsCtrl(e, t, n, o, a) {
    this.$timeout = a, this.$mdConstant = t, this.$scope = e, this.parent = e.$parent, this.$log = n, this.$element = o, this.ngModelCtrl = null, this.userInputNgModelCtrl = null, this.userInputElement = null, this.items = [], this.selectedChip = -1, this.deleteHint = "Press delete to remove this chip.", this.deleteButtonLabel = "Remove", this.chipBuffer = "", this.useMdOnAppend = !1
}

function MdChips(e, t, n) {
    function o(o, a) {
        function i(e) {
            if (a.ngModel) {
                var t = r[0].querySelector(e);
                return t && t.outerHTML
            }
        }
        var r = a.$mdUserTemplate;
        a.$mdUserTemplate = null;
        var l = i("[md-chip-remove]") || CHIP_REMOVE_TEMPLATE,
            d = i("md-chip-template") || CHIP_DEFAULT_TEMPLATE,
            s = i("md-autocomplete") || i("input") || CHIP_INPUT_TEMPLATE,
            c = r.find("md-chip");
        return function(o, i, r, m) {
            angular.forEach(o.$$isolateBindings, function(e, t) {
                e.optional && angular.isUndefined(o[t]) && (o[t] = a.hasOwnProperty(a.$normalize(e.attrName)))
            }), e(i);
            var u = m[0];
            if (u.chipContentsTemplate = d, u.chipRemoveTemplate = l, u.chipInputTemplate = s, i.attr({
                    ariaHidden: !0,
                    tabindex: -1
                }).on("focus", function() {
                    u.onFocus()
                }), a.ngModel && (u.configureNgModel(i.controller("ngModel")), r.mdOnAppend && u.useMdOnAppendExpression(), s != CHIP_INPUT_TEMPLATE && n(function() {
                    0 === s.indexOf("<md-autocomplete") && u.configureAutocomplete(i.find("md-autocomplete").controller("mdAutocomplete")), u.configureUserInput(i.find("input"))
                })), c.length > 0) {
                var p = t(c)(o.$parent);
                n(function() {
                    i.find("md-chips-wrap").prepend(p)
                })
            }
        }
    }
    return {
        template: function(e, t) {
            return t.$mdUserTemplate = e.clone(), MD_CHIPS_TEMPLATE
        },
        require: ["mdChips"],
        restrict: "E",
        controller: "MdChipsCtrl",
        controllerAs: "$mdChipsCtrl",
        bindToController: !0,
        compile: o,
        scope: {
            readonly: "=readonly",
            placeholder: "@",
            secondaryPlaceholder: "@",
            mdOnAppend: "&",
            deleteHint: "@",
            deleteButtonLabel: "@",
            requireMatch: "=?mdRequireMatch"
        }
    }
}

function MdContactChipsCtrl() {
    this.selectedItem = null, this.searchText = ""
}

function MdContactChips(e) {
    function t(t, n) {
        return function(t, o, a, i) {
            angular.forEach(t.$$isolateBindings, function(e, o) {
                e.optional && angular.isUndefined(t[o]) && (t[o] = n.hasOwnProperty(n.$normalize(e.attrName)))
            }), e(o), o.attr("tabindex", "-1")
        }
    }
    return {
        template: function(e, t) {
            return MD_CONTACT_CHIPS_TEMPLATE
        },
        restrict: "E",
        controller: "MdContactChipsCtrl",
        controllerAs: "$mdContactChipsCtrl",
        bindToController: !0,
        compile: t,
        scope: {
            contactQuery: "&mdContacts",
            placeholder: "@",
            secondaryPlaceholder: "@",
            contactName: "@mdContactName",
            contactImage: "@mdContactImage",
            contactEmail: "@mdContactEmail",
            filterSelected: "=",
            contacts: "=ngModel",
            requireMatch: "=?mdRequireMatch"
        }
    }
}

function MdTab() {
    function e(e, t, n, o) {
        function a() {
            function e() {
                return n.label
            }

            function o() {
                var e = t.find("md-tab-label");
                return e.length ? e.remove().html() : void 0
            }

            function a() {
                var e = t.html();
                return t.empty(), e
            }
            n.label || (t.find("md-tab-label")[0] || t[0]).innerHTML;
            return e() || o() || a()
        }

        function i() {
            var e = t.find("md-tab-body"),
                o = e.length ? e.html() : n.label ? t.html() : null;
            return e.length ? e.remove() : n.label && t.empty(), o
        }
        if (o) {
            var r = t.parent()[0].getElementsByTagName("md-tab"),
                l = Array.prototype.indexOf.call(r, t[0]),
                d = o.insertTab({
                    scope: e,
                    parent: e.$parent,
                    index: l,
                    template: i(),
                    label: a()
                }, l);
            e.deselect = e.deselect || angular.noop, e.select = e.select || angular.noop, e.$watch("active", function(e) {
                e && o.select(d.getIndex())
            }), e.$watch("disabled", function() {
                o.refreshIndex()
            }), e.$on("$destroy", function() {
                o.removeTab(d)
            })
        }
    }
    return {
        require: "^?mdTabs",
        terminal: !0,
        scope: {
            label: "@",
            active: "=?mdActive",
            disabled: "=?ngDisabled",
            select: "&?mdOnSelect",
            deselect: "&?mdOnDeselect"
        },
        link: e
    }
}

function MdTabItem() {
    function e(e, t, n, o) {
        o && o.attachRipple(e, t)
    }
    return {
        require: "^?mdTabs",
        link: e
    }
}

function MdTabScroll(e) {
    return {
        restrict: "A",
        compile: function(t, n) {
            var o = e(n.mdTabScroll, null, !0);
            return function(e, t) {
                t.on("mousewheel", function(t) {
                    e.$apply(function() {
                        o(e, {
                            $event: t
                        })
                    })
                })
            }
        }
    }
}

function MdTabsController(e, t, n, o, a, i, r, l) {
    function d() {
        e.$watch("selectedIndex", T), e.$watch("$mdTabsCtrl.focusIndex", h), e.$watch("$mdTabsCtrl.offsetLeft", p), e.$watch("$mdTabsCtrl.hasContent", s), angular.element(n).on("resize", function() {
            e.$apply(b)
        }), o(A, 0, !1), o(x, 0, !1)
    }

    function s(e) {
        t[e ? "removeClass" : "addClass"]("md-no-tab-content")
    }

    function c() {
        var e = {};
        return e.wrapper = t[0].getElementsByTagName("md-tabs-wrapper")[0], e.canvas = e.wrapper.getElementsByTagName("md-tabs-canvas")[0], e.paging = e.canvas.getElementsByTagName("md-pagination-wrapper")[0], e.tabs = e.paging.getElementsByTagName("md-tab-item"), e.dummies = e.canvas.getElementsByTagName("md-dummy-tab"), e.inkBar = e.paging.getElementsByTagName("md-ink-bar")[0], e.contentsWrapper = t[0].getElementsByTagName("md-tabs-content-wrapper")[0], e.contents = e.contentsWrapper.getElementsByTagName("md-tab-content"), e
    }

    function m(t) {
        switch (t.keyCode) {
            case a.KEY_CODE.LEFT_ARROW:
                t.preventDefault(), u(-1, !0);
                break;
            case a.KEY_CODE.RIGHT_ARROW:
                t.preventDefault(), u(1, !0);
                break;
            case a.KEY_CODE.SPACE:
            case a.KEY_CODE.ENTER:
                t.preventDefault(), R || (e.selectedIndex = O.focusIndex)
        }
        O.lastClick = !1
    }

    function u(t, n) {
        var o, a = n ? O.focusIndex : e.selectedIndex;
        for (o = a + t; O.tabs[o] && O.tabs[o].scope.disabled; o += t);
        O.tabs[o] && (n ? O.focusIndex = o : e.selectedIndex = o)
    }

    function p(t) {
        var n = S() ? "" : "-" + t + "px";
        angular.element(F.paging).css("left", n), e.$broadcast("$mdTabsPaginationChanged")
    }

    function h(e, t) {
        e !== t && F.tabs[e] && (g(), f())
    }

    function f() {
        F.dummies[O.focusIndex].focus()
    }

    function g() {
        if (!S()) {
            var e = F.tabs[O.focusIndex],
                t = e.offsetLeft,
                n = e.offsetWidth + t;
            O.offsetLeft = Math.max(O.offsetLeft, P(n - F.canvas.clientWidth)), O.offsetLeft = Math.min(O.offsetLeft, P(t))
        }
    }

    function b() {
        O.lastSelectedIndex = e.selectedIndex, A(), O.offsetLeft = P(O.offsetLeft)
    }

    function v() {
        G.forEach(function(e) {
            o(e)
        }), G = []
    }

    function E(t, n) {
        var o = {
                getIndex: function() {
                    return O.tabs.indexOf(a)
                },
                isActive: function() {
                    return this.getIndex() === e.selectedIndex
                },
                isLeft: function() {
                    return this.getIndex() < e.selectedIndex
                },
                isRight: function() {
                    return this.getIndex() > e.selectedIndex
                },
                hasFocus: function() {
                    return !O.lastClick && O.hasFocus && this.getIndex() === O.focusIndex
                },
                id: r.nextUid()
            },
            a = angular.extend(o, t);
        return angular.isDefined(n) ? O.tabs.splice(n, 0, a) : O.tabs.push(a), v(), M(), a
    }

    function M() {
        var e = !1;
        angular.forEach(O.tabs, function(t) {
            t.template && (e = !0)
        }), O.hasContent = e
    }

    function y(e) {
        O.tabs.splice(e.getIndex(), 1), C(), o(function() {
            A(), O.offsetLeft = P(O.offsetLeft)
        })
    }

    function C() {
        e.selectedIndex = k(e.selectedIndex), O.focusIndex = k(O.focusIndex)
    }

    function T(t, n) {
        t !== n && (e.selectedIndex = k(t), O.lastSelectedIndex = n, A(), x(), e.$broadcast("$mdTabsChanged"), O.tabs[n] && O.tabs[n].scope.deselect(), O.tabs[t] && O.tabs[t].scope.select())
    }

    function $() {
        $.watcher || ($.watcher = e.$watch(function() {
            o(function() {
                $.watcher && t.prop("offsetParent") && ($.watcher(), $.watcher = null, e.$apply(b))
            }, 0, !1)
        }))
    }

    function x() {
        if (!e.dynamicHeight) return t.css("height", "");
        if (!O.tabs.length) return G.push(x);
        var n = F.contents[e.selectedIndex],
            o = n ? n.offsetHeight : 0,
            a = F.wrapper.offsetHeight,
            i = o + a,
            r = t.prop("clientHeight");
        r !== i && (R = !0, l.animate(t, {
            height: r + "px"
        }, {
            height: i + "px"
        }).then(function() {
            t.css("height", ""), R = !1
        }))
    }

    function A() {
        if (!O.tabs.length) return G.push(A);
        if (!t.prop("offsetParent")) return $();
        var n = e.selectedIndex,
            o = F.paging.offsetWidth,
            a = F.tabs[n],
            i = a.offsetLeft,
            r = o - i - a.offsetWidth;
        w(), angular.element(F.inkBar).css({
            left: i + "px",
            right: r + "px"
        })
    }

    function w() {
        var t = e.selectedIndex,
            n = O.lastSelectedIndex,
            o = angular.element(F.inkBar);
        o.removeClass("md-left md-right"), angular.isNumber(n) && (n > t ? o.addClass("md-left") : t > n && o.addClass("md-right"))
    }

    function k(e) {
        var t, n, o = Math.max(O.tabs.length - e, e);
        for (t = 0; o >= t; t++) {
            if (n = O.tabs[e + t], n && n.scope.disabled !== !0) return n.getIndex();
            if (n = O.tabs[e - t], n && n.scope.disabled !== !0) return n.getIndex()
        }
        return e
    }

    function N() {
        switch (e.stretchTabs) {
            case "always":
                return !0;
            case "never":
                return !1;
            default:
                return !_() && n.matchMedia("(max-width: 600px)").matches
        }
    }

    function S() {
        return e.centerTabs && !_()
    }

    function _() {
        if (e.noPagination) return !1;
        var n = t.prop("clientWidth");
        return angular.forEach(F.tabs, function(e) {
            n -= e.offsetWidth
        }), 0 > n
    }

    function D(t) {
        R || (O.focusIndex = e.selectedIndex = t), O.lastClick = !0
    }

    function H(e) {
        _() && (e.preventDefault(), O.offsetLeft = P(O.offsetLeft - e.wheelDelta))
    }

    function P(e) {
        if (!F.tabs.length || !_()) return 0;
        var t = F.tabs[F.tabs.length - 1],
            n = t.offsetLeft + t.offsetWidth;
        return e = Math.max(0, e), e = Math.min(n - F.canvas.clientWidth, e)
    }

    function j() {
        var e, t, n = F.canvas.clientWidth,
            o = n + O.offsetLeft;
        for (e = 0; e < F.tabs.length && (t = F.tabs[e], !(t.offsetLeft + t.offsetWidth > o)); e++);
        O.offsetLeft = P(t.offsetLeft)
    }

    function I() {
        var e, t;
        for (e = 0; e < F.tabs.length && (t = F.tabs[e], !(t.offsetLeft + t.offsetWidth >= O.offsetLeft)); e++);
        O.offsetLeft = P(t.offsetLeft + t.offsetWidth - F.canvas.clientWidth)
    }

    function L() {
        return O.offsetLeft > 0
    }

    function B() {
        var e = F.tabs[F.tabs.length - 1];
        return e && e.offsetLeft + e.offsetWidth > F.canvas.clientWidth + O.offsetLeft
    }

    function U(e, t) {
        var n = {
            colorElement: angular.element(F.inkBar)
        };
        i.attachTabBehavior(e, t, n)
    }
    var O = this,
        R = !1,
        F = c(),
        G = [];
    O.scope = e, O.parent = e.$parent, O.tabs = [], O.lastSelectedIndex = null, O.focusIndex = 0, O.offsetLeft = 0, O.hasContent = !1, O.hasFocus = !1, O.lastClick = !1, O.redirectFocus = f, O.attachRipple = U, O.shouldStretchTabs = N, O.shouldPaginate = _, O.shouldCenterTabs = S, O.insertTab = E, O.removeTab = y, O.select = D, O.scroll = H, O.nextPage = j, O.previousPage = I, O.keydown = m, O.canPageForward = B, O.canPageBack = L, O.refreshIndex = C, O.incrementSelectedIndex = u, O.updateInkBarStyles = A, d()
}

function MdTabs(e) {
    return {
        scope: {
            noPagination: "=?mdNoPagination",
            dynamicHeight: "=?mdDynamicHeight",
            centerTabs: "=?mdCenterTabs",
            selectedIndex: "=?mdSelected",
            stretchTabs: "@?mdStretchTabs"
        },
        transclude: !0,
        template: '      <md-tabs-wrapper ng-class="{ \'md-stretch-tabs\': $mdTabsCtrl.shouldStretchTabs() }">        <md-tab-data ng-transclude></md-tab-data>        <md-prev-button            tabindex="-1"            role="button"            aria-label="Previous Page"            aria-disabled="{{!$mdTabsCtrl.canPageBack()}}"            ng-class="{ \'md-disabled\': !$mdTabsCtrl.canPageBack() }"            ng-if="$mdTabsCtrl.shouldPaginate()"            ng-click="$mdTabsCtrl.previousPage()">          <md-icon md-svg-icon="tabs-arrow"></md-icon>        </md-prev-button>        <md-next-button            tabindex="-1"            role="button"            aria-label="Next Page"            aria-disabled="{{!$mdTabsCtrl.canPageForward()}}"            ng-class="{ \'md-disabled\': !$mdTabsCtrl.canPageForward() }"            ng-if="$mdTabsCtrl.shouldPaginate()"            ng-click="$mdTabsCtrl.nextPage()">          <md-icon md-svg-icon="tabs-arrow"></md-icon>        </md-next-button>        <md-tabs-canvas            tabindex="0"            aria-activedescendant="tab-item-{{$mdTabsCtrl.tabs[$mdTabsCtrl.focusIndex].id}}"            ng-focus="$mdTabsCtrl.redirectFocus()"            ng-class="{ \'md-paginated\': $mdTabsCtrl.shouldPaginate() }"            ng-keydown="$mdTabsCtrl.keydown($event)"            role="tablist">          <md-pagination-wrapper              ng-class="{ \'md-center-tabs\': $mdTabsCtrl.shouldCenterTabs() }"              md-tab-scroll="$mdTabsCtrl.scroll($event)">            <md-tab-item                tabindex="-1"                class="md-tab"                style="max-width: {{ tabWidth ? tabWidth + \'px\' : \'none\' }}"                ng-repeat="tab in $mdTabsCtrl.tabs"                role="tab"                aria-controls="tab-content-{{tab.id}}"                aria-selected="{{tab.isActive()}}"                aria-disabled="{{tab.scope.disabled || \'false\'}}"                ng-click="$mdTabsCtrl.select(tab.getIndex())"                ng-class="{                    \'md-active\':    tab.isActive(),                    \'md-focused\':   tab.hasFocus(),                    \'md-disabled\':  tab.scope.disabled                }"                ng-disabled="tab.scope.disabled"                md-swipe-left="$mdTabsCtrl.nextPage()"                md-swipe-right="$mdTabsCtrl.previousPage()"                md-template="tab.label"                md-scope="tab.parent"></md-tab-item>            <md-ink-bar ng-hide="noInkBar"></md-ink-bar>          </md-pagination-wrapper>          <div class="md-visually-hidden md-dummy-wrapper">            <md-dummy-tab                tabindex="-1"                id="tab-item-{{tab.id}}"                role="tab"                aria-controls="tab-content-{{tab.id}}"                aria-selected="{{tab.isActive()}}"                aria-disabled="{{tab.scope.disabled || \'false\'}}"                ng-focus="$mdTabsCtrl.hasFocus = true"                ng-blur="$mdTabsCtrl.hasFocus = false"                ng-repeat="tab in $mdTabsCtrl.tabs"                md-template="tab.label"                md-scope="tab.parent"></md-dummy-tab>          </div>        </md-tabs-canvas>      </md-tabs-wrapper>      <md-tabs-content-wrapper ng-show="$mdTabsCtrl.hasContent">        <md-tab-content            id="tab-content-{{tab.id}}"            role="tabpanel"            aria-labelledby="tab-item-{{tab.id}}"            md-swipe-left="$mdTabsCtrl.incrementSelectedIndex(1)"            md-swipe-right="$mdTabsCtrl.incrementSelectedIndex(-1)"            ng-if="$mdTabsCtrl.hasContent"            ng-repeat="(index, tab) in $mdTabsCtrl.tabs"             md-template="tab.template"            md-scope="tab.parent"            ng-class="{              \'md-no-transition\': $mdTabsCtrl.lastSelectedIndex == null,              \'md-active\':        tab.isActive(),              \'md-left\':          tab.isLeft(),              \'md-right\':         tab.isRight(),              \'md-no-scroll\':     dynamicHeight            }"></md-tab-content>      </md-tabs-content-wrapper>    ',
        controller: "MdTabsController",
        controllerAs: "$mdTabsCtrl",
        link: function(t, n, o) {
            angular.forEach(t.$$isolateBindings, function(e, n) {
                e.optional && angular.isUndefined(t[n]) && (t[n] = o.hasOwnProperty(o.$normalize(e.attrName)))
            }), o.$observe("mdNoBar", function(e) {
                t.noInkBar = angular.isDefined(e)
            }), t.selectedIndex = angular.isNumber(t.selectedIndex) ? t.selectedIndex : 0, e(n)
        }
    }
}

function MdTemplate(e) {
        function t(t, n, o, a) {
            a && (n.html(t.template), e(n.contents())(t.compileScope))
        }
        return {
            restrict: "A",
            link: t,
            scope: {
                template: "=mdTemplate",
                compileScope: "=mdScope"
            },
            require: "^?mdTabs"
        }
    }! function() {
        angular.module("angularytics", []).provider("Angularytics", function() {
            var e = ["Google"];
            this.setEventHandlers = function(n) {
                angular.isString(n) && (n = [n]), e = [], angular.forEach(n, function(n) {
                    e.push(t(n))
                })
            };
            var t = function(e) {
                    return e.charAt(0).toUpperCase() + e.substring(1)
                },
                n = "$locationChangeSuccess";
            this.setPageChangeEvent = function(e) {
                n = e
            }, this.$get = ["$injector", "$rootScope", "$location", function(t, o, a) {
                var i = [];
                angular.forEach(e, function(e) {
                    i.push(t.get("Angularytics" + e + "Handler"))
                });
                var r = function(e) {
                        angular.forEach(i, function(t) {
                            e(t)
                        })
                    },
                    l = {};
                return l.init = function() {}, l.trackEvent = function(e, t, n, o, a) {
                    r(function(i) {
                        e && t && i.trackEvent(e, t, n, o, a)
                    })
                }, l.trackPageView = function(e) {
                    r(function(t) {
                        e && t.trackPageView(e)
                    })
                }, o.$on(n, function() {
                    l.trackPageView(a.url())
                }), l
            }]
        })
    }(),
    function() {
        angular.module("angularytics").factory("AngularyticsConsoleHandler", ["$log", function(e) {
            var t = {};
            return t.trackPageView = function(t) {
                e.log("URL visited", t)
            }, t.trackEvent = function(t, n, o, a, i) {
                e.log("Event tracked", t, n, o, a, i)
            }, t
        }])
    }(),
    function() {
        angular.module("angularytics").factory("AngularyticsGoogleHandler", ["$log", function(e) {
            var t = {};
            return t.trackPageView = function(e) {
                _gaq.push(["_set", "page", e]), _gaq.push(["_trackPageview", e])
            }, t.trackEvent = function(e, t, n, o, a) {
                _gaq.push(["_trackEvent", e, t, n, o, a])
            }, t
        }]).factory("AngularyticsGoogleUniversalHandler", function() {
            var e = {};
            return e.trackPageView = function(e) {
                ga("set", "page", e), ga("send", "pageview", e)
            }, e.trackEvent = function(e, t, n, o, a) {
                ga("send", "event", e, t, n, o, {
                    nonInteraction: a
                })
            }, e
        })
    }(),
    function() {
        angular.module("angularytics").filter("trackEvent", ["Angularytics", function(e) {
            return function(t, n, o, a, i, r) {
                return e.trackEvent(n, o, a, i, r), t
            }
        }])
    }(), angular.module("ngMaterial", ["ng", "ngAnimate", "ngAria", "material.core", "material.core.gestures", "material.core.theming.palette", "material.core.theming", "material.components.autocomplete", "material.components.backdrop", "material.components.bottomSheet", "material.components.button", "material.components.card", "material.components.checkbox", "material.components.chips", "material.components.content", "material.components.dialog", "material.components.divider", "material.components.gridList", "material.components.icon", "material.components.input", "material.components.list", "material.components.progressCircular", "material.components.progressLinear", "material.components.radioButton", "material.components.select", "material.components.sidenav", "material.components.slider", "material.components.sticky", "material.components.subheader", "material.components.swipe", "material.components.switch", "material.components.tabs", "material.components.toast", "material.components.toolbar", "material.components.tooltip", "material.components.whiteframe"]),
    function() {
        "use strict";

        function e(e, n) {
            e.decorator("$$rAF", ["$delegate", t]), n.theme("default").primaryPalette("indigo").accentPalette("pink").warnPalette("red").backgroundPalette("grey")
        }

        function t(e) {
            return e.throttle = function(t) {
                var n, o, a, i;
                return function() {
                    n = arguments, i = this, a = t, o || (o = !0, e(function() {
                        a.apply(i, n), o = !1
                    }))
                }
            }, e
        }
        angular.module("material.core", ["material.core.gestures", "material.core.theming"]).config(e), e.$inject = ["$provide", "$mdThemingProvider"]
    }(),
    function() {
        "use strict";

        function e(e, t) {
            function n(e) {
                return o ? "webkit" + e.charAt(0).toUpperCase() + e.substring(1) : e
            }
            var o = /webkit/i.test(t.vendorPrefix);
            return {
                KEY_CODE: {
                    ENTER: 13,
                    ESCAPE: 27,
                    SPACE: 32,
                    LEFT_ARROW: 37,
                    UP_ARROW: 38,
                    RIGHT_ARROW: 39,
                    DOWN_ARROW: 40,
                    TAB: 9,
                    BACKSPACE: 8,
                    DELETE: 46
                },
                CSS: {
                    TRANSITIONEND: "transitionend" + (o ? " webkitTransitionEnd" : ""),
                    ANIMATIONEND: "animationend" + (o ? " webkitAnimationEnd" : ""),
                    TRANSFORM: n("transform"),
                    TRANSFORM_ORIGIN: n("transformOrigin"),
                    TRANSITION: n("transition"),
                    TRANSITION_DURATION: n("transitionDuration"),
                    ANIMATION_PLAY_STATE: n("animationPlayState"),
                    ANIMATION_DURATION: n("animationDuration"),
                    ANIMATION_NAME: n("animationName"),
                    ANIMATION_TIMING: n("animationTimingFunction"),
                    ANIMATION_DIRECTION: n("animationDirection")
                },
                MEDIA: {
                    sm: "(max-width: 600px)",
                    "gt-sm": "(min-width: 600px)",
                    md: "(min-width: 600px) and (max-width: 960px)",
                    "gt-md": "(min-width: 960px)",
                    lg: "(min-width: 960px) and (max-width: 1200px)",
                    "gt-lg": "(min-width: 1200px)"
                },
                MEDIA_PRIORITY: ["gt-lg", "lg", "gt-md", "md", "gt-sm", "sm"]
            }
        }
        angular.module("material.core").factory("$mdConstant", e), e.$inject = ["$$rAF", "$sniffer"]
    }(),
    function() {
        function e(e, t) {
            function n() {
                return [].concat(b)
            }

            function o() {
                return b.length
            }

            function a(e) {
                return b.length && e > -1 && e < b.length
            }

            function i(e) {
                return e ? a(m(e) + 1) : !1
            }

            function r(e) {
                return e ? a(m(e) - 1) : !1
            }

            function l(e) {
                return a(e) ? b[e] : null
            }

            function d(e, t) {
                return b.filter(function(n) {
                    return n[e] === t
                })
            }

            function s(e, t) {
                return e ? (angular.isNumber(t) || (t = b.length), b.splice(t, 0, e), m(e)) : -1
            }

            function c(e) {
                u(e) && b.splice(m(e), 1)
            }

            function m(e) {
                return b.indexOf(e)
            }

            function u(e) {
                return e && m(e) > -1
            }

            function p() {
                return b.length ? b[0] : null
            }

            function h() {
                return b.length ? b[b.length - 1] : null
            }

            function f(e, n, o, i) {
                o = o || g;
                for (var r = m(n);;) {
                    if (!a(r)) return null;
                    var l = r + (e ? -1 : 1),
                        d = null;
                    if (a(l) ? d = b[l] : t && (d = e ? h() : p(), l = m(d)), null === d || l === i) return null;
                    if (o(d)) return d;
                    angular.isUndefined(i) && (i = l), r = l
                }
            }
            var g = function() {
                return !0
            };
            e && !angular.isArray(e) && (e = Array.prototype.slice.call(e)), t = !!t;
            var b = e || [];
            return {
                items: n,
                count: o,
                inRange: a,
                contains: u,
                indexOf: m,
                itemAt: l,
                findBy: d,
                add: s,
                remove: c,
                first: p,
                last: h,
                next: angular.bind(null, f, !1),
                previous: angular.bind(null, f, !0),
                hasPrevious: r,
                hasNext: i
            }
        }
        angular.module("material.core").config(["$provide", function(t) {
            t.decorator("$mdUtil", ["$delegate", function(t) {
                return t.iterator = e, t
            }])
        }])
    }(),
    function() {
        function e(e, t, n) {
            function o(e) {
                var t = m[e];
                angular.isUndefined(t) && (t = m[e] = a(e));
                var n = p[t];
                return angular.isUndefined(n) && (n = i(t)), n
            }

            function a(t) {
                return e.MEDIA[t] || ("(" !== t.charAt(0) ? "(" + t + ")" : t)
            }

            function i(e) {
                var t = u[e] = n.matchMedia(e);
                return t.addListener(r), p[t.media] = !!t.matches
            }

            function r(e) {
                t.$evalAsync(function() {
                    p[e.media] = !!e.matches
                })
            }

            function l(e) {
                return u[e]
            }

            function d(t, n) {
                for (var o = 0; o < e.MEDIA_PRIORITY.length; o++) {
                    var a = e.MEDIA_PRIORITY[o];
                    if (u[m[a]].matches) {
                        var i = c(t, n + "-" + a);
                        if (t[i]) return t[i]
                    }
                }
                return t[c(t, n)]
            }

            function s(t, n, o) {
                var a = [];
                return t.forEach(function(t) {
                        var i = c(n, t);
                        n[i] && a.push(n.$observe(i, angular.bind(void 0, o, null)));
                        for (var r in e.MEDIA) {
                            if (i = c(n, t + "-" + r), !n[i]) return;
                            a.push(n.$observe(i, angular.bind(void 0, o, r)))
                        }
                    }),
                    function() {
                        a.forEach(function(e) {
                            e()
                        })
                    }
            }

            function c(e, t) {
                return h[t] || (h[t] = e.$normalize(t))
            }
            var m = {},
                u = {},
                p = {},
                h = {};
            return o.getResponsiveAttribute = d, o.getQuery = l, o.watchResponsiveAttributes = s, o
        }
        angular.module("material.core").factory("$mdMedia", e), e.$inject = ["$mdConstant", "$rootScope", "$window"]
    }(),
    function() {
        "use strict";
        var e = ["0", "0", "0"];
        angular.module("material.core").factory("$mdUtil", ["$cacheFactory", "$document", "$timeout", "$q", "$window", "$mdConstant", function(t, n, o, a, i, r) {
            function l(e) {
                return e[0] || e
            }
            var d;
            return d = {
                now: window.performance ? angular.bind(window.performance, window.performance.now) : Date.now,
                clientRect: function(e, t, n) {
                    var o = l(e);
                    t = l(t || o.offsetParent || document.body);
                    var a = o.getBoundingClientRect(),
                        i = n ? t.getBoundingClientRect() : {
                            left: 0,
                            top: 0,
                            width: 0,
                            height: 0
                        };
                    return {
                        left: a.left - i.left,
                        top: a.top - i.top,
                        width: a.width,
                        height: a.height
                    }
                },
                offsetRect: function(e, t) {
                    return d.clientRect(e, t, !0)
                },
                disableScrollAround: function(e) {
                    function t() {
                        p ? r.attr("style", p) : r[0].removeAttribute("style"), g.css("position", "static");
                        var e = i.getComputedStyle(r[0]);
                        o(e);
                        var t = r[0].clientWidth;
                        "border-box" == e.boxSizing && (t -= parseFloat(e.paddingLeft, 10), t -= parseFloat(e.paddingRight, 10)), f.css({
                            "max-width": t + "px"
                        }), r.css("position", "relative"), g.css("position", "absolute")
                    }

                    function o(e) {
                        var t = !d.floatingScrollbars() && "hidden" != e.overflowY && (g[0].clientHeight > l.clientHeight || b),
                            n = -1 * (m - parseFloat(h.paddingTop, 10));
                        r.css("padding-top", "0px"), t && r.css("overflow-y", "scroll"), g.css("top", n + "px");
                        var o = parseFloat(e.height, 10);
                        return "border-box" == e.boxSizing && (o -= parseFloat(e.paddingTop, 10), o -= parseFloat(e.paddingBottom, 10)), f.css("height", o + "px"), t
                    }

                    function a(e) {
                        return e instanceof angular.element && (e = e[0]), e.scrollHeight > e.offsetHeight
                    }
                    for (var r, l, s, c = e[0] || e; c = this.getClosest(c.parentNode, "MD-CONTENT", !0);) a(c) && (r = angular.element(c));
                    r || (r = angular.element(n[0].body)), "BODY" == r[0].nodeName && n[0].documentElement.scrollTop ? (l = n[0].documentElement, s = !0) : l = r[0];
                    var m = l.scrollTop,
                        u = l.clientWidth,
                        p = r.attr("style"),
                        h = i.getComputedStyle(r[0]),
                        f = angular.element('<div class="md-virtual-scroll-container"><div class="md-virtual-scroller"></div></div>'),
                        g = f.children().eq(0);
                    g.append(r.children()), r.append(f);
                    var b = u < l.clientWidth;
                    return o(h), g.attr("layout-margin", r.attr("layout-margin")), g.css({
                            display: h.display,
                            "-webkit-flex-direction": h.webkitFlexDirection,
                            "-ms-flex-direction": h.msFlexDirection,
                            "flex-direction": h.flexDirection,
                            "-webkit-align-items": h.webkitAlignItems,
                            "-ms-flex-align": h.msFlexAlign,
                            "align-items": h.alignItems,
                            "-webkit-justify-content": h.webkitJustifyContent,
                            "-ms-flex-pack": h.msFlexPack,
                            "justify-content": h.justifyContent,
                            "-webkit-flex": h.webkitFlex,
                            "-ms-flex": h.msFlex,
                            flex: h.flex
                        }), t(), angular.element(i).on("resize", t),
                        function() {
                            r.append(g.children()), f.remove(), angular.element(i).off("resize", t), r.attr("style", p || !1), s ? n[0].documentElement.scrollTop = m : r[0].scrollTop = m
                        }
                },
                floatingScrollbars: function() {
                    if (void 0 === this.floatingScrollbars.cached) {
                        var e = angular.element('<div style="width: 100%; z-index: -1; position: absolute; height: 35px; overflow-y: scroll"><div style="height: 60;"></div></div>');
                        n[0].body.appendChild(e[0]), this.floatingScrollbars.cached = e[0].offsetWidth == e[0].childNodes[0].offsetWidth, e.remove()
                    }
                    return this.floatingScrollbars.cached
                },
                forceFocus: function(e) {
                    var t = e[0] || e;
                    document.addEventListener("click", function o(e) {
                        e.target === t && e.$focus && (t.focus(), e.stopImmediatePropagation(), e.preventDefault(), t.removeEventListener("click", o))
                    }, !0);
                    var n = document.createEvent("MouseEvents");
                    n.initMouseEvent("click", !1, !0, window, {}, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), n.$material = !0, n.$focus = !0, t.dispatchEvent(n)
                },
                transitionEndPromise: function(e, t) {
                    function n(t) {
                        t && t.target !== e[0] || (e.off(r.CSS.TRANSITIONEND, n), i.resolve())
                    }
                    t = t || {};
                    var i = a.defer();
                    return e.on(r.CSS.TRANSITIONEND, n), t.timeout && o(n, t.timeout), i.promise
                },
                fakeNgModel: function() {
                    return {
                        $fake: !0,
                        $setTouched: angular.noop,
                        $setViewValue: function(e) {
                            this.$viewValue = e, this.$render(e), this.$viewChangeListeners.forEach(function(e) {
                                e()
                            })
                        },
                        $isEmpty: function(e) {
                            return 0 === ("" + e).length
                        },
                        $parsers: [],
                        $formatters: [],
                        $viewChangeListeners: [],
                        $render: angular.noop
                    }
                },
                debounce: function(e, t, n, a) {
                    var i;
                    return function() {
                        var r = n,
                            l = Array.prototype.slice.call(arguments);
                        o.cancel(i), i = o(function() {
                            i = void 0, e.apply(r, l)
                        }, t || 10, a)
                    }
                },
                throttle: function(e, t) {
                    var n;
                    return function() {
                        var o = this,
                            a = arguments,
                            i = d.now();
                        (!n || i - n > t) && (e.apply(o, a), n = i)
                    }
                },
                time: function(e) {
                    var t = d.now();
                    return e(), d.now() - t
                },
                nextUid: function() {
                    for (var t, n = e.length; n;) {
                        if (n--, t = e[n].charCodeAt(0), 57 == t) return e[n] = "A", e.join("");
                        if (90 != t) return e[n] = String.fromCharCode(t + 1), e.join("");
                        e[n] = "0"
                    }
                    return e.unshift("0"), e.join("")
                },
                disconnectScope: function(e) {
                    if (e && e.$root !== e && !e.$$destroyed) {
                        var t = e.$parent;
                        e.$$disconnected = !0, t.$$childHead === e && (t.$$childHead = e.$$nextSibling), t.$$childTail === e && (t.$$childTail = e.$$prevSibling), e.$$prevSibling && (e.$$prevSibling.$$nextSibling = e.$$nextSibling), e.$$nextSibling && (e.$$nextSibling.$$prevSibling = e.$$prevSibling), e.$$nextSibling = e.$$prevSibling = null
                    }
                },
                reconnectScope: function(e) {
                    if (e && e.$root !== e && e.$$disconnected) {
                        var t = e,
                            n = t.$parent;
                        t.$$disconnected = !1, t.$$prevSibling = n.$$childTail, n.$$childHead ? (n.$$childTail.$$nextSibling = t, n.$$childTail = t) : n.$$childHead = n.$$childTail = t
                    }
                },
                getClosest: function(e, t, n) {
                    if (e instanceof angular.element && (e = e[0]), t = t.toUpperCase(), n && (e = e.parentNode), !e) return null;
                    do
                        if (e.nodeName === t) return e;
                    while (e = e.parentNode);
                    return null
                },
                extractElementByName: function(e, t) {
                    for (var n = 0, o = e.length; o > n; n++)
                        if (e[n].nodeName.toLowerCase() === t) return angular.element(e[n]);
                    return e
                }
            }
        }]), angular.element.prototype.focus = angular.element.prototype.focus || function() {
            return this.length && this[0].focus(), this
        }, angular.element.prototype.blur = angular.element.prototype.blur || function() {
            return this.length && this[0].blur(), this
        }
    }(),
    function() {
        "use strict";

        function e(e, t, n) {
            function o(e, n, o) {
                var a = e[0] || e;
                !a || a.hasAttribute(n) && 0 !== a.getAttribute(n).length || l(a, n) || (o = angular.isString(o) ? o.trim() : "", o.length ? e.attr(n, o) : t.warn('ARIA: Attribute "', n, '", required for accessibility, is missing on node:', a))
            }

            function a(t, n, a) {
                e(function() {
                    o(t, n, a())
                })
            }

            function i(e, t) {
                a(e, t, function() {
                    return r(e)
                })
            }

            function r(e) {
                return e.text().trim()
            }

            function l(e, t) {
                function o(e) {
                    var t = e.currentStyle ? e.currentStyle : n.getComputedStyle(e);
                    return "none" === t.display
                }
                var a = e.hasChildNodes(),
                    i = !1;
                if (a)
                    for (var r = e.childNodes, l = 0; l < r.length; l++) {
                        var d = r[l];
                        1 === d.nodeType && d.hasAttribute(t) && (o(d) || (i = !0))
                    }
                return i
            }
            return {
                expect: o,
                expectAsync: a,
                expectWithText: i
            }
        }
        angular.module("material.core").service("$mdAria", e), e.$inject = ["$$rAF", "$log", "$window"]
    }(),
    function() {
        "use strict";

        function e(e, t, n, o, a, i) {
            this.compile = function(r) {
                var l = r.templateUrl,
                    d = r.template || "",
                    s = r.controller,
                    c = r.controllerAs,
                    m = r.resolve || {},
                    u = r.locals || {},
                    p = r.transformTemplate || angular.identity,
                    h = r.bindToController;
                return angular.forEach(m, function(e, t) {
                    m[t] = angular.isString(e) ? n.get(e) : n.invoke(e)
                }), angular.extend(m, u), m.$template = l ? t.get(l, {
                    cache: i
                }).then(function(e) {
                    return e.data
                }) : e.when(d), e.all(m).then(function(e) {
                    var t = p(e.$template),
                        n = r.element || angular.element("<div>").html(t.trim()).contents(),
                        i = o(n);
                    return {
                        locals: e,
                        element: n,
                        link: function(t) {
                            if (e.$scope = t, s) {
                                var o = a(s, e);
                                h && angular.extend(o, e), n.data("$ngControllerController", o), n.children().data("$ngControllerController", o), c && (t[c] = o)
                            }
                            return i(t)
                        }
                    }
                })
            }
        }
        angular.module("material.core").service("$mdCompiler", e), e.$inject = ["$q", "$http", "$injector", "$compile", "$controller", "$templateCache"]
    }(),
    function(e) {
        "use strict";

        function t() {}

        function n(t, n, o) {
            function a(e, t, n) {
                var o = u[t.replace(/^\$md./, "")];
                if (!o) throw new Error("Failed to register element with handler " + t + ". Available handlers: " + Object.keys(u).join(", "));
                return o.registerElement(e, n)
            }

            function i(e, n) {
                var o = new t(e);
                return angular.extend(o, n), u[e] = o, m
            }
            var l = navigator.userAgent || navigator.vendor || window.opera,
                s = l.match(/ipad|iphone|ipod/i),
                c = l.match(/android/i),
                m = {
                    handler: i,
                    register: a,
                    isHijackingClicks: (s || c) && !e && !p
                };
            return m.isHijackingClicks && m.handler("click", {
                options: {
                    maxDistance: 6
                },
                onEnd: function(e, t) {
                    t.distance < this.state.options.maxDistance && this.dispatchEvent(e, "click")
                }
            }), m.handler("press", {
                onStart: function(e, t) {
                    this.dispatchEvent(e, "$md.pressdown")
                },
                onEnd: function(e, t) {
                    this.dispatchEvent(e, "$md.pressup")
                }
            }).handler("hold", {
                options: {
                    maxDistance: 6,
                    delay: 500
                },
                onCancel: function() {
                    o.cancel(this.state.timeout)
                },
                onStart: function(e, t) {
                    return this.state.registeredParent ? (this.state.pos = {
                        x: t.x,
                        y: t.y
                    }, void(this.state.timeout = o(angular.bind(this, function() {
                        this.dispatchEvent(e, "$md.hold"), this.cancel()
                    }), this.state.options.delay, !1))) : this.cancel()
                },
                onMove: function(e, t) {
                    e.preventDefault();
                    var n = this.state.pos.x - t.x,
                        o = this.state.pos.y - t.y;
                    Math.sqrt(n * n + o * o) > this.options.maxDistance && this.cancel()
                },
                onEnd: function() {
                    this.onCancel()
                }
            }).handler("drag", {
                options: {
                    minDistance: 6,
                    horizontal: !0,
                    cancelMultiplier: 1.5
                },
                onStart: function(e) {
                    this.state.registeredParent || this.cancel()
                },
                onMove: function(e, t) {
                    var n, o;
                    e.preventDefault(), this.state.dragPointer ? this.dispatchDragMove(e) : (this.state.options.horizontal ? (n = Math.abs(t.distanceX) > this.state.options.minDistance, o = Math.abs(t.distanceY) > this.state.options.minDistance * this.state.options.cancelMultiplier) : (n = Math.abs(t.distanceY) > this.state.options.minDistance, o = Math.abs(t.distanceX) > this.state.options.minDistance * this.state.options.cancelMultiplier), n ? (this.state.dragPointer = r(e), d(e, this.state.dragPointer), this.dispatchEvent(e, "$md.dragstart", this.state.dragPointer)) : o && this.cancel())
                },
                dispatchDragMove: n.throttle(function(e) {
                    this.state.isRunning && (d(e, this.state.dragPointer), this.dispatchEvent(e, "$md.drag", this.state.dragPointer))
                }),
                onEnd: function(e, t) {
                    this.state.dragPointer && (d(e, this.state.dragPointer), this.dispatchEvent(e, "$md.dragend", this.state.dragPointer))
                }
            }).handler("swipe", {
                options: {
                    minVelocity: .65,
                    minDistance: 10
                },
                onEnd: function(e, t) {
                    if (Math.abs(t.velocityX) > this.state.options.minVelocity && Math.abs(t.distanceX) > this.state.options.minDistance) {
                        var n = "left" == t.directionX ? "$md.swipeleft" : "$md.swiperight";
                        this.dispatchEvent(e, n)
                    }
                }
            })
        }

        function o(e) {
            this.name = e, this.state = {}
        }

        function a(t) {
            function n(e, t, n) {
                n = n || c;
                var o = new angular.element.Event(t);
                o.$material = !0, o.pointer = n, o.srcEvent = e, angular.extend(o, {
                    clientX: n.x,
                    clientY: n.y,
                    screenX: n.x,
                    screenY: n.y,
                    pageX: n.x,
                    pageY: n.y,
                    ctrlKey: e.ctrlKey,
                    altKey: e.altKey,
                    shiftKey: e.shiftKey,
                    metaKey: e.metaKey
                }), angular.element(n.target).trigger(o)
            }

            function a(e, t, n) {
                n = n || c;
                var o;
                "click" === t ? (o = document.createEvent("MouseEvents"), o.initMouseEvent("click", !0, !0, window, e.detail, n.x, n.y, n.x, n.y, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget || null)) : (o = document.createEvent("CustomEvent"),
                    o.initCustomEvent(t, !0, !0, {})), o.$material = !0, o.pointer = n, o.srcEvent = e, n.target.dispatchEvent(o)
            }
            var i = "undefined" != typeof e && angular.element === e;
            return o.prototype = {
                options: {},
                dispatchEvent: i ? n : a,
                onStart: angular.noop,
                onMove: angular.noop,
                onEnd: angular.noop,
                onCancel: angular.noop,
                start: function(e, t) {
                    if (!this.state.isRunning) {
                        var n = this.getNearestParent(e.target),
                            o = n && n.$mdGesture[this.name] || {};
                        this.state = {
                            isRunning: !0,
                            options: angular.extend({}, this.options, o),
                            registeredParent: n
                        }, this.onStart(e, t)
                    }
                },
                move: function(e, t) {
                    this.state.isRunning && this.onMove(e, t)
                },
                end: function(e, t) {
                    this.state.isRunning && (this.onEnd(e, t), this.state.isRunning = !1)
                },
                cancel: function(e, t) {
                    this.onCancel(e, t), this.state = {}
                },
                getNearestParent: function(e) {
                    for (var t = e; t;) {
                        if ((t.$mdGesture || {})[this.name]) return t;
                        t = t.parentNode
                    }
                    return null
                },
                registerElement: function(e, t) {
                    function n() {
                        delete e[0].$mdGesture[o.name], e.off("$destroy", n)
                    }
                    var o = this;
                    return e[0].$mdGesture = e[0].$mdGesture || {}, e[0].$mdGesture[this.name] = t || {}, e.on("$destroy", n), n
                }
            }, o
        }

        function i(e, t) {
            function n(e, n) {
                var o;
                for (var a in u) o = u[a], o instanceof t && ("start" === e && o.cancel(), o[e](n, c))
            }

            function o(e) {
                if (!c) {
                    var t = +Date.now();
                    m && !l(e, m) && t - m.endTime < 1500 || (c = r(e), n("start", e))
                }
            }

            function a(e) {
                c && l(e, c) && (d(e, c), n("move", e))
            }

            function i(e) {
                c && l(e, c) && (d(e, c), c.endTime = +Date.now(), n("end", e), m = c, c = null)
            }
            document.contains || (document.contains = function(e) {
                return document.body.contains(e)
            }), !h && e.isHijackingClicks && (document.addEventListener("click", function(e) {
                var t = 0 === e.clientX && 0 === e.clientY;
                t || e.$material || (e.preventDefault(), e.stopPropagation())
            }, !0), h = !0);
            var s = "mousedown touchstart pointerdown",
                p = "mousemove touchmove pointermove",
                f = "mouseup mouseleave touchend touchcancel pointerup pointercancel";
            angular.element(document).on(s, o).on(p, a).on(f, i).on("$$mdGestureReset", function() {
                m = c = null
            })
        }

        function r(e) {
            var t = s(e),
                n = {
                    startTime: +Date.now(),
                    target: e.target,
                    type: e.type.charAt(0)
                };
            return n.startX = n.x = t.pageX, n.startY = n.y = t.pageY, n
        }

        function l(e, t) {
            return e && t && e.type.charAt(0) === t.type
        }

        function d(e, t) {
            var n = s(e),
                o = t.x = n.pageX,
                a = t.y = n.pageY;
            t.distanceX = o - t.startX, t.distanceY = a - t.startY, t.distance = Math.sqrt(t.distanceX * t.distanceX + t.distanceY * t.distanceY), t.directionX = t.distanceX > 0 ? "right" : t.distanceX < 0 ? "left" : "", t.directionY = t.distanceY > 0 ? "up" : t.distanceY < 0 ? "down" : "", t.duration = +Date.now() - t.startTime, t.velocityX = t.distanceX / t.duration, t.velocityY = t.distanceY / t.duration
        }

        function s(e) {
            return e = e.originalEvent || e, e.touches && e.touches[0] || e.changedTouches && e.changedTouches[0] || e
        }
        var c, m, u = {},
            p = !1,
            h = !1;
        angular.module("material.core.gestures", []).provider("$mdGesture", t).factory("$$MdGestureHandler", a).run(i), t.prototype = {
            skipClickHijack: function() {
                return p = !0
            },
            $get: ["$$MdGestureHandler", "$$rAF", "$timeout", function(e, t, o) {
                return new n(e, t, o)
            }]
        }, a.$inject = ["$$rAF"], i.$inject = ["$mdGesture", "$$MdGestureHandler"]
    }(window.jQuery),
    function() {
        "use strict";

        function e() {
            function e(e) {
                function t(e) {
                    return l.optionsFactory = e.options, l.methods = (e.methods || []).concat(i), d
                }

                function n(e, t) {
                    return r[e] = t, d
                }

                function o(t, n) {
                    if (n = n || {}, n.methods = n.methods || [], n.options = n.options || function() {
                            return {}
                        }, /^cancel|hide|show$/.test(t)) throw new Error("Preset '" + t + "' in " + e + " is reserved!");
                    if (n.methods.indexOf("_options") > -1) throw new Error("Method '_options' in " + e + " is reserved!");
                    return l.presets[t] = {
                        methods: n.methods.concat(i),
                        optionsFactory: n.options,
                        argOption: n.argOption
                    }, d
                }

                function a(t, n, o) {
                    function a(e) {
                        return e && e._options && (e = e._options), c.show(angular.extend({}, s, e))
                    }

                    function i(t, n) {
                        var a = {};
                        return a[e] = m, o.invoke(t || function() {
                            return n
                        }, {}, a)
                    }
                    var d, s, c = t(),
                        m = {
                            hide: c.hide,
                            cancel: c.cancel,
                            show: a
                        };
                    return d = l.methods || [], s = i(l.optionsFactory, {}), angular.forEach(r, function(e, t) {
                        m[t] = e
                    }), angular.forEach(l.presets, function(e, t) {
                        function n(e) {
                            this._options = angular.extend({}, o, e)
                        }
                        var o = i(e.optionsFactory, {}),
                            a = (e.methods || []).concat(d);
                        if (angular.extend(o, {
                                $type: t
                            }), angular.forEach(a, function(e) {
                                n.prototype[e] = function(t) {
                                    return this._options[e] = t, this
                                }
                            }), e.argOption) {
                            var r = "show" + t.charAt(0).toUpperCase() + t.slice(1);
                            m[r] = function(e) {
                                var n = m[t](e);
                                return m.show(n)
                            }
                        }
                        m[t] = function(t) {
                            return arguments.length && e.argOption && !angular.isObject(t) && !angular.isArray(t) ? (new n)[e.argOption](t) : new n(t)
                        }
                    }), m
                }
                var i = ["onHide", "onShow", "onRemove"],
                    r = {},
                    l = {
                        presets: {}
                    },
                    d = {
                        setDefaults: t,
                        addPreset: o,
                        addMethod: n,
                        $get: a
                    };
                return d.addPreset("build", {
                    methods: ["controller", "controllerAs", "resolve", "template", "templateUrl", "themable", "transformTemplate", "parent"]
                }), a.$inject = ["$$interimElement", "$animate", "$injector"], d
            }

            function t(e, t, n, o, a, i, r, l, d) {
                function s(e) {
                    return e && angular.isString(e) ? e.replace(/\{\{/g, c).replace(/}}/g, m) : e
                }
                var c = r.startSymbol(),
                    m = r.endSymbol(),
                    u = "{{" === c && "}}" === m,
                    p = u ? angular.identity : s;
                return function() {
                    function r(e) {
                        if (h.length) return u.cancel().then(function() {
                            return r(e)
                        });
                        var t = new m(e);
                        return h.push(t), t.show().then(function() {
                            return t.deferred.promise
                        })
                    }

                    function s(e) {
                        var t = h.shift();
                        return t && t.remove().then(function() {
                            t.deferred.resolve(e)
                        })
                    }

                    function c(e) {
                        var n = h.shift();
                        return t.when(n && n.remove().then(function() {
                            n.deferred.reject(e)
                        }))
                    }

                    function m(r) {
                        var s, c, m, h, f;
                        return r = r || {}, r = angular.extend({
                            preserveScope: !1,
                            scope: r.scope || n.$new(r.isolateScope),
                            onShow: function(e, t, n) {
                                return i.enter(t, n.parent)
                            },
                            onRemove: function(e, n, o) {
                                return n && i.leave(n) || t.when()
                            }
                        }, r), r.template && (r.template = p(r.template)), s = {
                            options: r,
                            deferred: t.defer(),
                            show: function() {
                                var n;
                                return n = r.skipCompile ? t(function(e) {
                                    e({
                                        locals: {},
                                        link: function() {
                                            return r.element
                                        }
                                    })
                                }) : l.compile(r), h = n.then(function(n) {
                                    function i() {
                                        r.hideDelay && (c = o(u.cancel, r.hideDelay))
                                    }
                                    angular.extend(n.locals, s.options), m = n.link(r.scope), angular.isFunction(r.parent) ? r.parent = r.parent(r.scope, m, r) : angular.isString(r.parent) && (r.parent = angular.element(e[0].querySelector(r.parent))), (r.parent || {}).length || (r.parent = a.find("body"), r.parent.length || (r.parent = a), "#comment" == r.parent[0].nodeName && (r.parent = e.find("body"))), r.themable && d(m);
                                    var l = r.onShow(r.scope, m, r);
                                    return t.when(l).then(function() {
                                        (r.onComplete || angular.noop)(r.scope, m, r), i()
                                    })
                                }, function(e) {
                                    h = !0, s.deferred.reject(e)
                                })
                            },
                            cancelTimeout: function() {
                                c && (o.cancel(c), c = void 0)
                            },
                            remove: function() {
                                return s.cancelTimeout(), f = t.when(h).then(function() {
                                    var e = m ? r.onRemove(r.scope, m, r) : !0;
                                    return t.when(e).then(function() {
                                        r.preserveScope || r.scope.$destroy(), f = !0
                                    })
                                })
                            }
                        }
                    }
                    var u, h = [];
                    return u = {
                        show: r,
                        hide: s,
                        cancel: c
                    }
                }
            }
            return e.$get = t, t.$inject = ["$document", "$q", "$rootScope", "$timeout", "$rootElement", "$animate", "$interpolate", "$mdCompiler", "$mdTheming"], e
        }
        angular.module("material.core").provider("$$interimElement", e)
    }(),
    function() {
        "use strict";

        function e(e, t) {
            function n(e) {
                return e && "" !== e
            }
            var o, a = [],
                i = {};
            return o = {
                notFoundError: function(t) {
                    e.error("No instance found for handle", t)
                },
                getInstances: function() {
                    return a
                },
                get: function(e) {
                    if (!n(e)) return null;
                    var t, o, i;
                    for (t = 0, o = a.length; o > t; t++)
                        if (i = a[t], i.$$mdHandle === e) return i;
                    return null
                },
                register: function(e, t) {
                    function n() {
                        var t = a.indexOf(e); - 1 !== t && a.splice(t, 1)
                    }

                    function o() {
                        var n = i[t];
                        n && (n.resolve(e), delete i[t])
                    }
                    return t ? (e.$$mdHandle = t, a.push(e), o(), n) : angular.noop
                },
                when: function(e) {
                    if (n(e)) {
                        var a = t.defer(),
                            r = o.get(e);
                        return r ? a.resolve(r) : i[e] = a, a.promise
                    }
                    return t.reject("Invalid `md-component-id` value.")
                }
            }
        }
        angular.module("material.core").factory("$mdComponentRegistry", e), e.$inject = ["$log", "$q"]
    }(),
    function() {
        "use strict";

        function e(e) {
            return {
                controller: angular.noop,
                link: function(t, n, o) {
                    o.hasOwnProperty("mdInkRippleCheckbox") ? e.attachCheckboxBehavior(t, n) : e.attachButtonBehavior(t, n)
                }
            }
        }

        function t(e, t) {
            function n(e, t, n) {
                return r(e, t, angular.extend({
                    fullRipple: !0,
                    isMenuItem: t.hasClass("md-menu-item"),
                    center: !1,
                    dimBackground: !0
                }, n))
            }

            function o(e, t, n) {
                return r(e, t, angular.extend({
                    center: !0,
                    dimBackground: !1,
                    fitRipple: !0
                }, n))
            }

            function a(e, t, n) {
                return r(e, t, angular.extend({
                    center: !1,
                    dimBackground: !0,
                    outline: !1,
                    rippleSize: "full"
                }, n))
            }

            function i(e, t, n) {
                return r(e, t, angular.extend({
                    center: !1,
                    dimBackground: !0,
                    outline: !1,
                    rippleSize: "full"
                }, n))
            }

            function r(n, o, a) {
                function i() {
                    var e = o.data("$mdRippleContainer");
                    return e ? e : (e = angular.element('<div class="md-ripple-container">'), o.append(e), o.data("$mdRippleContainer", e), e)
                }

                function r(e) {
                    function t(e) {
                        var t = "#" === e.charAt(0) ? e.substr(1) : e,
                            n = t.length / 3,
                            o = t.substr(0, n),
                            a = t.substr(n, n),
                            i = t.substr(2 * n);
                        return 1 === n && (o += o, a += a, i += i), "rgba(" + parseInt(o, 16) + "," + parseInt(a, 16) + "," + parseInt(i, 16) + ",0.1)"
                    }

                    function n(e) {
                        return e.replace(")", ", 0.1)").replace("(", "a(")
                    }
                    if (e) return 0 === e.indexOf("rgba") ? e.replace(/\d?\.?\d*\s*\)\s*$/, "0.1)") : 0 === e.indexOf("rgb") ? n(e) : 0 === e.indexOf("#") ? t(e) : void 0
                }

                function l(e, n) {
                    g.splice(g.indexOf(e), 1), 0 === g.length && i().css({
                        backgroundColor: ""
                    }), t(function() {
                        e.remove()
                    }, n, !1)
                }

                function d(e) {
                    var t = g.indexOf(e),
                        n = b[t] || {},
                        o = g.length > 1 ? !1 : E,
                        i = g.length > 1 ? !1 : M;
                    o || n.animating || i ? e.addClass("md-ripple-visible") : e && (e.removeClass("md-ripple-visible"), a.outline && e.css({
                        width: p + "px",
                        height: p + "px",
                        marginLeft: -1 * p + "px",
                        marginTop: -1 * p + "px"
                    }), l(e, a.outline ? 450 : 650))
                }

                function s(n, l) {
                    function s(e) {
                        var t = angular.element('<div class="md-ripple" data-counter="' + f++ + '">');
                        return g.unshift(t), b.unshift({
                            animating: !0
                        }), u.append(t), e && t.css(e), t
                    }

                    function c(e, t) {
                        var n, o, i, r = u.prop("offsetWidth"),
                            l = u.prop("offsetHeight");
                        return a.isMenuItem ? o = Math.sqrt(Math.pow(r, 2) + Math.pow(l, 2)) : a.outline ? (i = y.getBoundingClientRect(), e -= i.left, t -= i.top, r = Math.max(e, r - e), l = Math.max(t, l - t), o = 2 * Math.sqrt(Math.pow(r, 2) + Math.pow(l, 2))) : (n = a.fullRipple ? 1.1 : .8, o = Math.sqrt(Math.pow(r, 2) + Math.pow(l, 2)) * n, a.fitRipple && (o = Math.min(l, r, o))), o
                    }

                    function m(e, t, n) {
                        function o(e) {
                            return e.replace("rgba", "rgb").replace(/,[^\),]+\)/, ")")
                        }
                        var i = y.getBoundingClientRect(),
                            r = {
                                backgroundColor: o(T),
                                borderColor: o(T),
                                width: e + "px",
                                height: e + "px"
                            };
                        return a.outline ? (r.width = 0, r.height = 0) : r.marginLeft = r.marginTop = e * -.5 + "px", a.center ? r.left = r.top = "50%" : (r.left = Math.round((t - i.left) / u.prop("offsetWidth") * 100) + "%", r.top = Math.round((n - i.top) / u.prop("offsetHeight") * 100) + "%"), r
                    }
                    T = r(o.attr("md-ink-ripple")) || r(e.getComputedStyle(a.colorElement[0]).color || "rgb(0, 0, 0)");
                    var u = i(),
                        h = c(n, l),
                        v = m(h, n, l),
                        E = s(v),
                        M = g.indexOf(E),
                        C = b[M] || {};
                    return p = h, C.animating = !0, t(function() {
                        a.dimBackground && u.css({
                            backgroundColor: T
                        }), E.addClass("md-ripple-placed md-ripple-scaled"), E.css(a.outline ? {
                            borderWidth: .5 * h + "px",
                            marginLeft: h * -.5 + "px",
                            marginTop: h * -.5 + "px"
                        } : {
                            left: "50%",
                            top: "50%"
                        }), d(E), t(function() {
                            C.animating = !1, d(E)
                        }, a.outline ? 450 : 225, !1)
                    }, 0, !1), E
                }

                function c(e) {
                    u() && (s(e.pointer.x, e.pointer.y), M = !0)
                }

                function m() {
                    M = !1;
                    var e = g[g.length - 1];
                    t(function() {
                        d(e)
                    }, 0, !1)
                }

                function u() {
                    function e(e) {
                        return e && e.hasAttribute && e.hasAttribute("disabled")
                    }
                    var t = y.parentNode,
                        n = t && t.parentNode,
                        o = n && n.parentNode;
                    return !(e(y) || e(t) || e(n) || e(o))
                }
                if (o.controller("mdNoInk")) return angular.noop;
                a = angular.extend({
                    colorElement: o,
                    mousedown: !0,
                    hover: !0,
                    focus: !0,
                    center: !1,
                    mousedownPauseTime: 150,
                    dimBackground: !1,
                    outline: !1,
                    fullRipple: !0,
                    isMenuItem: !1,
                    fitRipple: !1
                }, a);
                var p, h = o.controller("mdInkRipple") || {},
                    f = 0,
                    g = [],
                    b = [],
                    v = o.attr("md-highlight"),
                    E = !1,
                    M = !1,
                    y = o[0],
                    C = o.attr("md-ripple-size"),
                    T = r(o.attr("md-ink-ripple")) || r(a.colorElement.length && e.getComputedStyle(a.colorElement[0]).color || "rgb(0, 0, 0)");
                switch (C) {
                    case "full":
                        a.fullRipple = !0;
                        break;
                    case "partial":
                        a.fullRipple = !1
                }
                return a.mousedown && o.on("$md.pressdown", c).on("$md.pressup", m), h.createRipple = s, v && n.$watch(v, function(e) {
                        E = e, E && !g.length && t(function() {
                            s(0, 0)
                        }, 0, !1), angular.forEach(g, d)
                    }),
                    function() {
                        o.off("$md.pressdown", c).off("$md.pressup", m), i().remove()
                    }
            }
            return {
                attachButtonBehavior: n,
                attachCheckboxBehavior: o,
                attachTabBehavior: a,
                attachListControlBehavior: i,
                attach: r
            }
        }

        function n() {
            return function() {
                return {
                    controller: angular.noop
                }
            }
        }
        angular.module("material.core").factory("$mdInkRipple", t).directive("mdInkRipple", e).directive("mdNoInk", n()).directive("mdNoBar", n()).directive("mdNoStretch", n()), e.$inject = ["$mdInkRipple"], t.$inject = ["$window", "$timeout"]
    }(),
    function() {
        "use strict";
        angular.module("material.core.theming.palette", []).constant("$mdColorPalette", {
            red: {
                50: "#ffebee",
                100: "#ffcdd2",
                200: "#ef9a9a",
                300: "#e57373",
                400: "#ef5350",
                500: "#f44336",
                600: "#e53935",
                700: "#d32f2f",
                800: "#c62828",
                900: "#b71c1c",
                A100: "#ff8a80",
                A200: "#ff5252",
                A400: "#ff1744",
                A700: "#d50000",
                contrastDefaultColor: "light",
                contrastDarkColors: "50 100 200 300 400 A100",
                contrastStrongLightColors: "500 600 700 A200 A400 A700"
            },
            pink: {
                50: "#fce4ec",
                100: "#f8bbd0",
                200: "#f48fb1",
                300: "#f06292",
                400: "#ec407a",
                500: "#e91e63",
                600: "#d81b60",
                700: "#c2185b",
                800: "#ad1457",
                900: "#880e4f",
                A100: "#ff80ab",
                A200: "#ff4081",
                A400: "#f50057",
                A700: "#c51162",
                contrastDefaultColor: "light",
                contrastDarkColors: "50 100 200 300 400 A100",
                contrastStrongLightColors: "500 600 A200 A400 A700"
            },
            purple: {
                50: "#f3e5f5",
                100: "#e1bee7",
                200: "#ce93d8",
                300: "#ba68c8",
                400: "#ab47bc",
                500: "#9c27b0",
                600: "#8e24aa",
                700: "#7b1fa2",
                800: "#6a1b9a",
                900: "#4a148c",
                A100: "#ea80fc",
                A200: "#e040fb",
                A400: "#d500f9",
                A700: "#aa00ff",
                contrastDefaultColor: "light",
                contrastDarkColors: "50 100 200 A100",
                contrastStrongLightColors: "300 400 A200 A400 A700"
            },
            "deep-purple": {
                50: "#ede7f6",
                100: "#d1c4e9",
                200: "#b39ddb",
                300: "#9575cd",
                400: "#7e57c2",
                500: "#673ab7",
                600: "#5e35b1",
                700: "#512da8",
                800: "#4527a0",
                900: "#311b92",
                A100: "#b388ff",
                A200: "#7c4dff",
                A400: "#651fff",
                A700: "#6200ea",
                contrastDefaultColor: "light",
                contrastDarkColors: "50 100 200 A100",
                contrastStrongLightColors: "300 400 A200"
            },
            indigo: {
                50: "#e8eaf6",
                100: "#c5cae9",
                200: "#9fa8da",
                300: "#7986cb",
                400: "#5c6bc0",
                500: "#3f51b5",
                600: "#3949ab",
                700: "#303f9f",
                800: "#283593",
                900: "#1a237e",
                A100: "#8c9eff",
                A200: "#536dfe",
                A400: "#3d5afe",
                A700: "#304ffe",
                contrastDefaultColor: "light",
                contrastDarkColors: "50 100 200 A100",
                contrastStrongLightColors: "300 400 A200 A400"
            },
            blue: {
                50: "#e3f2fd",
                100: "#bbdefb",
                200: "#90caf9",
                300: "#64b5f6",
                400: "#42a5f5",
                500: "#2196f3",
                600: "#1e88e5",
                700: "#1976d2",
                800: "#1565c0",
                900: "#0d47a1",
                A100: "#82b1ff",
                A200: "#448aff",
                A400: "#2979ff",
                A700: "#2962ff",
                contrastDefaultColor: "light",
                contrastDarkColors: "100 200 300 400 A100",
                contrastStrongLightColors: "500 600 700 A200 A400 A700"
            },
            "light-blue": {
                50: "#e1f5fe",
                100: "#b3e5fc",
                200: "#81d4fa",
                300: "#4fc3f7",
                400: "#29b6f6",
                500: "#03a9f4",
                600: "#039be5",
                700: "#0288d1",
                800: "#0277bd",
                900: "#01579b",
                A100: "#80d8ff",
                A200: "#40c4ff",
                A400: "#00b0ff",
                A700: "#0091ea",
                contrastDefaultColor: "dark",
                contrastLightColors: "500 600 700 800 900 A700",
                contrastStrongLightColors: "500 600 700 800 A700"
            },
            cyan: {
                50: "#e0f7fa",
                100: "#b2ebf2",
                200: "#80deea",
                300: "#4dd0e1",
                400: "#26c6da",
                500: "#00bcd4",
                600: "#00acc1",
                700: "#0097a7",
                800: "#00838f",
                900: "#006064",
                A100: "#84ffff",
                A200: "#18ffff",
                A400: "#00e5ff",
                A700: "#00b8d4",
                contrastDefaultColor: "dark",
                contrastLightColors: "500 600 700 800 900",
                contrastStrongLightColors: "500 600 700 800"
            },
            teal: {
                50: "#e0f2f1",
                100: "#b2dfdb",
                200: "#80cbc4",
                300: "#4db6ac",
                400: "#26a69a",
                500: "#009688",
                600: "#00897b",
                700: "#00796b",
                800: "#00695c",
                900: "#004d40",
                A100: "#a7ffeb",
                A200: "#64ffda",
                A400: "#1de9b6",
                A700: "#00bfa5",
                contrastDefaultColor: "dark",
                contrastLightColors: "500 600 700 800 900",
                contrastStrongLightColors: "500 600 700"
            },
            green: {
                50: "#e8f5e9",
                100: "#c8e6c9",
                200: "#a5d6a7",
                300: "#81c784",
                400: "#66bb6a",
                500: "#4caf50",
                600: "#43a047",
                700: "#388e3c",
                800: "#2e7d32",
                900: "#1b5e20",
                A100: "#b9f6ca",
                A200: "#69f0ae",
                A400: "#00e676",
                A700: "#00c853",
                contrastDefaultColor: "dark",
                contrastLightColors: "500 600 700 800 900",
                contrastStrongLightColors: "500 600 700"
            },
            "light-green": {
                50: "#f1f8e9",
                100: "#dcedc8",
                200: "#c5e1a5",
                300: "#aed581",
                400: "#9ccc65",
                500: "#8bc34a",
                600: "#7cb342",
                700: "#689f38",
                800: "#558b2f",
                900: "#33691e",
                A100: "#ccff90",
                A200: "#b2ff59",
                A400: "#76ff03",
                A700: "#64dd17",
                contrastDefaultColor: "dark",
                contrastLightColors: "800 900",
                contrastStrongLightColors: "800 900"
            },
            lime: {
                50: "#f9fbe7",
                100: "#f0f4c3",
                200: "#e6ee9c",
                300: "#dce775",
                400: "#d4e157",
                500: "#cddc39",
                600: "#c0ca33",
                700: "#afb42b",
                800: "#9e9d24",
                900: "#827717",
                A100: "#f4ff81",
                A200: "#eeff41",
                A400: "#c6ff00",
                A700: "#aeea00",
                contrastDefaultColor: "dark",
                contrastLightColors: "900",
                contrastStrongLightColors: "900"
            },
            yellow: {
                50: "#fffde7",
                100: "#fff9c4",
                200: "#fff59d",
                300: "#fff176",
                400: "#ffee58",
                500: "#ffeb3b",
                600: "#fdd835",
                700: "#fbc02d",
                800: "#f9a825",
                900: "#f57f17",
                A100: "#ffff8d",
                A200: "#ffff00",
                A400: "#ffea00",
                A700: "#ffd600",
                contrastDefaultColor: "dark"
            },
            amber: {
                50: "#fff8e1",
                100: "#ffecb3",
                200: "#ffe082",
                300: "#ffd54f",
                400: "#ffca28",
                500: "#ffc107",
                600: "#ffb300",
                700: "#ffa000",
                800: "#ff8f00",
                900: "#ff6f00",
                A100: "#ffe57f",
                A200: "#ffd740",
                A400: "#ffc400",
                A700: "#ffab00",
                contrastDefaultColor: "dark"
            },
            orange: {
                50: "#fff3e0",
                100: "#ffe0b2",
                200: "#ffcc80",
                300: "#ffb74d",
                400: "#ffa726",
                500: "#ff9800",
                600: "#fb8c00",
                700: "#f57c00",
                800: "#ef6c00",
                900: "#e65100",
                A100: "#ffd180",
                A200: "#ffab40",
                A400: "#ff9100",
                A700: "#ff6d00",
                contrastDefaultColor: "dark",
                contrastLightColors: "800 900",
                contrastStrongLightColors: "800 900"
            },
            "deep-orange": {
                50: "#fbe9e7",
                100: "#ffccbc",
                200: "#ffab91",
                300: "#ff8a65",
                400: "#ff7043",
                500: "#ff5722",
                600: "#f4511e",
                700: "#e64a19",
                800: "#d84315",
                900: "#bf360c",
                A100: "#ff9e80",
                A200: "#ff6e40",
                A400: "#ff3d00",
                A700: "#dd2c00",
                contrastDefaultColor: "light",
                contrastDarkColors: "50 100 200 300 400 A100 A200",
                contrastStrongLightColors: "500 600 700 800 900 A400 A700"
            },
            brown: {
                50: "#efebe9",
                100: "#d7ccc8",
                200: "#bcaaa4",
                300: "#a1887f",
                400: "#8d6e63",
                500: "#795548",
                600: "#6d4c41",
                700: "#5d4037",
                800: "#4e342e",
                900: "#3e2723",
                A100: "#d7ccc8",
                A200: "#bcaaa4",
                A400: "#8d6e63",
                A700: "#5d4037",
                contrastDefaultColor: "light",
                contrastDarkColors: "50 100 200",
                contrastStrongLightColors: "300 400"
            },
            grey: {
                0: "#ffffff",
                50: "#fafafa",
                100: "#f5f5f5",
                200: "#eeeeee",
                300: "#e0e0e0",
                400: "#bdbdbd",
                500: "#9e9e9e",
                600: "#757575",
                700: "#616161",
                800: "#424242",
                900: "#212121",
                1000: "#000000",
                A100: "#ffffff",
                A200: "#eeeeee",
                A400: "#bdbdbd",
                A700: "#616161",
                contrastDefaultColor: "dark",
                contrastLightColors: "600 700 800 900"
            },
            "blue-grey": {
                50: "#eceff1",
                100: "#cfd8dc",
                200: "#b0bec5",
                300: "#90a4ae",
                400: "#78909c",
                500: "#607d8b",
                600: "#546e7a",
                700: "#455a64",
                800: "#37474f",
                900: "#263238",
                A100: "#cfd8dc",
                A200: "#b0bec5",
                A400: "#78909c",
                A700: "#455a64",
                contrastDefaultColor: "light",
                contrastDarkColors: "50 100 200 300",
                contrastStrongLightColors: "400 500"
            }
        })
    }(),
    function() {
        "use strict";

        function e(e) {
            function t(e, t) {
                return t = t || {}, d[e] = a(e, t), g
            }

            function n(e, t) {
                return a(e, angular.extend({}, d[e] || {}, t))
            }

            function a(e, t) {
                var n = C.filter(function(e) {
                    return !t[e]
                });
                if (n.length) throw new Error("Missing colors %1 in palette %2!".replace("%1", n.join(", ")).replace("%2", e));
                return t
            }

            function i(e, t) {
                if (s[e]) return s[e];
                t = t || "default";
                var n = "string" == typeof t ? s[t] : t,
                    o = new r(e);
                return n && angular.forEach(n.colors, function(e, t) {
                    o.colors[t] = {
                        name: e.name,
                        hues: angular.extend({}, e.hues)
                    }
                }), s[e] = o, o
            }

            function r(e) {
                function t(e) {
                    if (e = 0 === arguments.length ? !0 : !!e, e !== n.isDark) {
                        n.isDark = e, n.foregroundPalette = n.isDark ? u : m, n.foregroundShadow = n.isDark ? p : h;
                        var t = n.isDark ? y : M,
                            o = n.isDark ? M : y;
                        return angular.forEach(t, function(e, t) {
                            var a = n.colors[t],
                                i = o[t];
                            if (a)
                                for (var r in a.hues) a.hues[r] === i[r] && (a.hues[r] = e[r])
                        }), n
                    }
                }
                var n = this;
                n.name = e, n.colors = {}, n.dark = t, t(!1), v.forEach(function(e) {
                    var t = (n.isDark ? y : M)[e];
                    n[e + "Palette"] = function(o, a) {
                        var i = n.colors[e] = {
                            name: o,
                            hues: angular.extend({}, t, a)
                        };
                        return Object.keys(i.hues).forEach(function(e) {
                            if (!t[e]) throw new Error("Invalid hue name '%1' in theme %2's %3 color %4. Available hue names: %4".replace("%1", e).replace("%2", n.name).replace("%3", o).replace("%4", Object.keys(t).join(", ")))
                        }), Object.keys(i.hues).map(function(e) {
                            return i.hues[e]
                        }).forEach(function(t) {
                            if (-1 == C.indexOf(t)) throw new Error("Invalid hue value '%1' in theme %2's %3 color %4. Available hue values: %5".replace("%1", t).replace("%2", n.name).replace("%3", e).replace("%4", o).replace("%5", C.join(", ")))
                        }), n
                    }, n[e + "Color"] = function() {
                        var t = Array.prototype.slice.call(arguments);
                        return console.warn("$mdThemingProviderTheme." + e + "Color() has been deprecated. Use $mdThemingProviderTheme." + e + "Palette() instead."), n[e + "Palette"].apply(n, t)
                    }
                })
            }

            function f(e, t) {
                function n(e) {
                    return void 0 === e || "" === e ? !0 : void 0 !== o.THEMES[e]
                }

                function o(t, n) {
                    void 0 === n && (n = t, t = void 0), void 0 === t && (t = e), o.inherit(n, n)
                }
                return o.inherit = function(o, a) {
                    function i(e) {
                        n(e) || t.warn("Attempted to use unregistered theme '" + e + "'. Register it with $mdThemingProvider.theme().");
                        var a = o.data("$mdThemeName");
                        a && o.removeClass("md-" + a + "-theme"), o.addClass("md-" + e + "-theme"), o.data("$mdThemeName", e)
                    }
                    var r = a.controller("mdTheme"),
                        l = o.attr("md-theme-watch");
                    if ((E || angular.isDefined(l)) && "false" != l) {
                        var d = e.$watch(function() {
                            return r && r.$mdTheme || b
                        }, i);
                        o.on("$destroy", d)
                    } else {
                        var s = r && r.$mdTheme || b;
                        i(s)
                    }
                }, o.THEMES = angular.extend({}, s), o.defaultTheme = function() {
                    return b
                }, o.registered = n, o
            }
            d = {}, s = {}, c = {};
            var g, b = "default",
                E = !1;
            return angular.extend(d, e), f.$inject = ["$rootScope", "$log"], g = {
                definePalette: t,
                extendPalette: n,
                theme: i,
                setDefaultTheme: function(e) {
                    b = e
                },
                alwaysWatchTheme: function(e) {
                    E = e
                },
                $get: f,
                _LIGHT_DEFAULT_HUES: M,
                _DARK_DEFAULT_HUES: y,
                _PALETTES: d,
                _THEMES: s,
                _parseRules: o,
                _rgba: l
            }
        }

        function t(e, t, n) {
            return {
                priority: 100,
                link: {
                    pre: function(o, a, i) {
                        var r = {
                            $setTheme: function(t) {
                                e.registered(t) || n.warn("attempted to use unregistered theme '" + t + "'"), r.$mdTheme = t
                            }
                        };
                        a.data("$mdThemeController", r), r.$setTheme(t(i.mdTheme)(o)), i.$observe("mdTheme", r.$setTheme)
                    }
                }
            }
        }

        function n(e) {
            return e
        }

        function o(e, t, n) {
            i(e, t), n = n.replace(/THEME_NAME/g, e.name);
            var o = [],
                a = e.colors[t],
                r = new RegExp(".md-" + e.name + "-theme", "g"),
                s = new RegExp("('|\")?{{\\s*(" + t + ")-(color|contrast)-?(\\d\\.?\\d*)?\\s*}}(\"|')?", "g"),
                c = /'?"?\{\{\s*([a-zA-Z]+)-(A?\d+|hue\-[0-3]|shadow)-?(\d\.?\d*)?\s*\}\}'?"?/g,
                m = d[a.name];
            return n = n.replace(c, function(t, n, o, a) {
                return "foreground" === n ? "shadow" == o ? e.foregroundShadow : e.foregroundPalette[o] || e.foregroundPalette[1] : (0 === o.indexOf("hue") && (o = e.colors[n].hues[o]), l((d[e.colors[n].name][o] || "").value, a))
            }), angular.forEach(a.hues, function(t, a) {
                var i = n.replace(s, function(e, n, o, a, i) {
                    return l(m[t]["color" === a ? "value" : "contrast"], i)
                });
                "default" !== a && (i = i.replace(r, ".md-" + e.name + "-theme.md-" + a)), o.push(i)
            }), o
        }

        function a(e) {
            function t(e) {
                var t = e.contrastDefaultColor,
                    n = e.contrastLightColors || [],
                    o = e.contrastStrongLightColors || [],
                    a = e.contrastDarkColors || [];
                "string" == typeof n && (n = n.split(" ")), "string" == typeof o && (o = o.split(" ")), "string" == typeof a && (a = a.split(" ")), delete e.contrastDefaultColor, delete e.contrastLightColors, delete e.contrastStrongLightColors, delete e.contrastDarkColors, angular.forEach(e, function(i, l) {
                    function d() {
                        return "light" === t ? a.indexOf(l) > -1 ? f : o.indexOf(l) > -1 ? b : g : n.indexOf(l) > -1 ? o.indexOf(l) > -1 ? b : g : f
                    }
                    if (!angular.isObject(i)) {
                        var s = r(i);
                        if (!s) throw new Error("Color %1, in palette %2's hue %3, is invalid. Hex or rgb(a) color expected.".replace("%1", i).replace("%2", e.name).replace("%3", l));
                        e[l] = {
                            value: s,
                            contrast: d()
                        }
                    }
                })
            }
            var n = document.getElementsByTagName("head")[0],
                a = n.firstElementChild,
                i = e.has("$MD_THEME_CSS") ? e.get("$MD_THEME_CSS") : "";
            angular.forEach(d, t);
            var l = {},
                m = i.split(/\}(?!(\}|'|"|;))/).filter(function(e) {
                    return e && e.length
                }).map(function(e) {
                    return e.trim() + "}"
                }),
                u = new RegExp("md-(" + v.join("|") + ")", "g");
            v.forEach(function(e) {
                l[e] = ""
            }), m.forEach(function(e) {
                for (var t, n = (e.match(u), 0); t = v[n]; n++)
                    if (e.indexOf(".md-" + t) > -1) return l[t] += e;
                for (n = 0; t = v[n]; n++)
                    if (e.indexOf(t) > -1) return l[t] += e;
                return l[E] += e
            }), angular.forEach(s, function(e) {
                c[e.name] || (v.forEach(function(t) {
                    for (var i = o(e, t, l[t]); i.length;) {
                        var r = document.createElement("style");
                        r.setAttribute("type", "text/css"), r.appendChild(document.createTextNode(i.shift())), n.insertBefore(r, a)
                    }
                }), e.colors.primary.name == e.colors.accent.name && console.warn("$mdThemingProvider: Using the same palette for primary and accent. This violates the material design spec."), c[e.name] = !0)
            })
        }

        function i(e, t) {
            if (!d[(e.colors[t] || {}).name]) throw new Error("You supplied an invalid color palette for theme %1's %2 palette. Available palettes: %3".replace("%1", e.name).replace("%2", t).replace("%3", Object.keys(d).join(", ")))
        }

        function r(e) {
            if (angular.isArray(e) && 3 == e.length) return e;
            if (/^rgb/.test(e)) return e.replace(/(^\s*rgba?\(|\)\s*$)/g, "").split(",").map(function(e, t) {
                return 3 == t ? parseFloat(e, 10) : parseInt(e, 10)
            });
            if ("#" == e.charAt(0) && (e = e.substring(1)), /^([a-fA-F0-9]{3}){1,2}$/g.test(e)) {
                var t = e.length / 3,
                    n = e.substr(0, t),
                    o = e.substr(t, t),
                    a = e.substr(2 * t);
                return 1 === t && (n += n, o += o, a += a), [parseInt(n, 16), parseInt(o, 16), parseInt(a, 16)]
            }
        }

        function l(e, t) {
            return 4 == e.length && (e = angular.copy(e), t ? e.pop() : t = e.pop()), t && ("number" == typeof t || "string" == typeof t && t.length) ? "rgba(" + e.join(",") + "," + t + ")" : "rgb(" + e.join(",") + ")"
        }
        angular.module("material.core.theming", ["material.core.theming.palette"]).directive("mdTheme", t).directive("mdThemable", n).provider("$mdTheming", e).run(a);
        var d, s, c, m = {
                name: "dark",
                1: "rgba(0,0,0,0.87)",
                2: "rgba(0,0,0,0.54)",
                3: "rgba(0,0,0,0.26)",
                4: "rgba(0,0,0,0.12)"
            },
            u = {
                name: "light",
                1: "rgba(255,255,255,1.0)",
                2: "rgba(255,255,255,0.7)",
                3: "rgba(255,255,255,0.3)",
                4: "rgba(255,255,255,0.12)"
            },
            p = "1px 1px 0px rgba(0,0,0,0.4), -1px -1px 0px rgba(0,0,0,0.4)",
            h = "",
            f = r("rgba(0,0,0,0.87)"),
            g = r("rgba(255,255,255,0.87"),
            b = r("rgb(255,255,255)"),
            v = ["primary", "accent", "warn", "background"],
            E = "primary",
            M = {
                accent: {
                    "default": "A200",
                    "hue-1": "A100",
                    "hue-2": "A400",
                    "hue-3": "A700"
                },
                background: {
                    "default": "A100",
                    "hue-1": "300",
                    "hue-2": "800",
                    "hue-3": "900"
                }
            },
            y = {
                background: {
                    "default": "800",
                    "hue-1": "300",
                    "hue-2": "600",
                    "hue-3": "900"
                }
            };
        v.forEach(function(e) {
            var t = {
                "default": "500",
                "hue-1": "300",
                "hue-2": "800",
                "hue-3": "A100"
            };
            M[e] || (M[e] = t), y[e] || (y[e] = t)
        });
        var C = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "A100", "A200", "A400", "A700"];
        e.$inject = ["$mdColorPalette"], t.$inject = ["$mdTheming", "$interpolate", "$log"], n.$inject = ["$mdTheming"], a.$inject = ["$injector"]
    }(), angular.module("material.components.autocomplete", ["material.core", "material.components.icon"]), angular.module("material.components.backdrop", ["material.core"]).directive("mdBackdrop", BackdropDirective), BackdropDirective.$inject = ["$mdTheming"], angular.module("material.components.bottomSheet", ["material.core", "material.components.backdrop"]).directive("mdBottomSheet", MdBottomSheetDirective).provider("$mdBottomSheet", MdBottomSheetProvider), MdBottomSheetProvider.$inject = ["$$interimElementProvider"], angular.module("material.components.button", ["material.core"]).directive("mdButton", MdButtonDirective), MdButtonDirective.$inject = ["$mdInkRipple", "$mdTheming", "$mdAria", "$timeout"], angular.module("material.components.card", ["material.core"]).directive("mdCard", mdCardDirective), mdCardDirective.$inject = ["$mdTheming"], angular.module("material.components.checkbox", ["material.core"]).directive("mdCheckbox", MdCheckboxDirective), MdCheckboxDirective.$inject = ["inputDirective", "$mdInkRipple", "$mdAria", "$mdConstant", "$mdTheming", "$mdUtil", "$timeout"], angular.module("material.components.chips", ["material.core", "material.components.autocomplete"]), angular.module("material.components.content", ["material.core"]).directive("mdContent", mdContentDirective), mdContentDirective.$inject = ["$mdTheming"], angular.module("material.components.dialog", ["material.core", "material.components.backdrop"]).directive("mdDialog", MdDialogDirective).provider("$mdDialog", MdDialogProvider), MdDialogDirective.$inject = ["$$rAF", "$mdTheming"], MdDialogProvider.$inject = ["$$interimElementProvider"], angular.module("material.components.divider", ["material.core"]).directive("mdDivider", MdDividerDirective), MdDividerDirective.$inject = ["$mdTheming"], angular.module("material.components.gridList", ["material.core"]).directive("mdGridList", GridListDirective).directive("mdGridTile", GridTileDirective).directive("mdGridTileFooter", GridTileCaptionDirective).directive("mdGridTileHeader", GridTileCaptionDirective).factory("$mdGridLayout", GridLayoutFactory), GridListDirective.$inject = ["$interpolate", "$mdConstant", "$mdGridLayout", "$mdMedia"], GridListController.$inject = ["$timeout"], GridListController.prototype = {
        addTile: function(e, t, n) {
            var o = {
                element: e,
                attrs: t
            };
            angular.isUndefined(n) ? this.tiles.push(o) : this.tiles.splice(n, 0, o), this.tilesAdded = !0, this.invalidateLayout()
        },
        removeTile: function(e, t) {
            var n = this._findTileIndex(t); - 1 !== n && (this.tiles.splice(n, 1), this.invalidateLayout())
        },
        invalidateLayout: function() {
            this.invalidated || (this.invalidated = !0, this.$timeout_(angular.bind(this, this.layout)))
        },
        layout: function() {
            try {
                this.layoutDelegate(this.tilesAdded)
            } finally {
                this.invalidated = !1, this.tilesAdded = !1
            }
        },
        _findTileIndex: function(e) {
            for (var t = 0; t < this.tiles.length; t++)
                if (this.tiles[t].attrs == e) return t;
            return -1
        }
    }, GridLayoutFactory.$inject = ["$mdUtil"], GridTileDirective.$inject = ["$mdMedia"], angular.module("material.components.icon", ["material.core"]).directive("mdIcon", mdIconDirective), mdIconDirective.$inject = ["$mdIcon", "$mdTheming", "$mdAria"], angular.module("material.components.icon").provider("$mdIcon", MdIconProvider);
var config = {
    defaultIconSize: 24
};
MdIconProvider.prototype = {
        icon: function(e, t, n) {
            return -1 == e.indexOf(":") && (e = "$default:" + e), config[e] = new ConfigurationItem(t, n), this
        },
        iconSet: function(e, t, n) {
            return config[e] = new ConfigurationItem(t, n), this
        },
        defaultIconSet: function(e, t) {
            var n = "$default";
            return config[n] || (config[n] = new ConfigurationItem(e, t)), config[n].iconSize = t || config.defaultIconSize, this
        },
        defaultIconSize: function(e) {
            return config.defaultIconSize = e, this
        },
        preloadIcons: function(e) {
            var t = this,
                n = [{
                    id: "tabs-arrow",
                    url: "tabs-arrow.svg",
                    svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 24 24"><g><polygon points="15.4,7.4 14,6 8,12 14,18 15.4,16.6 10.8,12 "/></g></svg>'
                }, {
                    id: "close",
                    url: "close.svg",
                    svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 24 24"><g><path d="M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z"/></g></svg>'
                }, {
                    id: "cancel",
                    url: "cancel.svg",
                    svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 24 24"><g><path d="M12 2c-5.53 0-10 4.47-10 10s4.47 10 10 10 10-4.47 10-10-4.47-10-10-10zm5 13.59l-1.41 1.41-3.59-3.59-3.59 3.59-1.41-1.41 3.59-3.59-3.59-3.59 1.41-1.41 3.59 3.59 3.59-3.59 1.41 1.41-3.59 3.59 3.59 3.59z"/></g></svg>'
                }, {
                    id: "menu",
                    url: "menu.svg",
                    svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 100 100"><path d="M 50 0 L 100 14 L 92 80 L 50 100 L 8 80 L 0 14 Z" fill="#b2b2b2"></path><path d="M 50 5 L 6 18 L 13.5 77 L 50 94 Z" fill="#E42939"></path><path d="M 50 5 L 94 18 L 86.5 77 L 50 94 Z" fill="#B72833"></path><path d="M 50 7 L 83 75 L 72 75 L 65 59 L 50 59 L 50 50 L 61 50 L 50 26 Z" fill="#b2b2b2"></path><path d="M 50 7 L 17 75 L 28 75 L 35 59 L 50 59 L 50 50 L 39 50 L 50 26 Z" fill="#fff"></path></svg>'
                }, {
                    id: "toggle-arrow",
                    url: "toggle-arrow-svg",
                    svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 48 48"><path d="M24 16l-12 12 2.83 2.83 9.17-9.17 9.17 9.17 2.83-2.83z"/><path d="M0 0h48v48h-48z" fill="none"/></svg>'
                }];
            n.forEach(function(n) {
                t.icon(n.id, n.url), e.put(n.url, n.svg)
            })
        },
        $get: ["$http", "$q", "$log", "$templateCache", function(e, t, n, o) {
            return this.preloadIcons(o), new MdIconService(config, e, t, n, o)
        }]
    },
    function() {
        function e(e, t) {
            function n(t, n, o) {
                e(n)
            }

            function o(e, n, o) {
                var a = this;
                a.isErrorGetter = o.mdIsError && t(o.mdIsError), a.delegateClick = function() {
                    a.input.focus()
                }, a.element = n, a.setFocused = function(e) {
                    n.toggleClass("md-input-focused", !!e)
                }, a.setHasValue = function(e) {
                    n.toggleClass("md-input-has-value", !!e)
                }, a.setInvalid = function(e) {
                    n.toggleClass("md-input-invalid", !!e)
                }, e.$watch(function() {
                    return a.label && a.input
                }, function(e) {
                    e && !a.label.attr("for") && a.label.attr("for", a.input.attr("id"))
                })
            }
            return o.$inject = ["$scope", "$element", "$attrs"], {
                restrict: "E",
                link: n,
                controller: o
            }
        }

        function t() {
            return {
                restrict: "E",
                require: "^?mdInputContainer",
                link: function(e, t, n, o) {
                    o && !n.mdNoFloat && (o.label = t, e.$on("$destroy", function() {
                        o.label = null
                    }))
                }
            }
        }

        function n(e, t, n) {
            function o(o, a, i, r) {
                function l(e) {
                    return c.setHasValue(!m.$isEmpty(e)), e
                }

                function d() {
                    c.setHasValue(a.val().length > 0 || (a[0].validity || {}).badInput)
                }

                function s() {
                    function n(e) {
                        return s(), e
                    }

                    function i() {
                        d.style.height = "auto", d.scrollTop = 0;
                        var e = r();
                        e && (d.style.height = e + "px")
                    }

                    function r() {
                        var e = d.scrollHeight - d.offsetHeight;
                        return d.offsetHeight + (e > 0 ? e : 0)
                    }

                    function l(e) {
                        d.scrollTop = 0;
                        var t = d.scrollHeight - d.offsetHeight,
                            n = d.offsetHeight + t;
                        d.style.height = n + "px"
                    }
                    var d = a[0],
                        s = e.debounce(i, 1);
                    m ? (m.$formatters.push(n), m.$viewChangeListeners.push(n)) : s(), a.on("keydown input", s), a.on("scroll", l), angular.element(t).on("resize", s),
                        o.$on("$destroy", function() {
                            angular.element(t).off("resize", s)
                        })
                }
                var c = r[0],
                    m = r[1] || e.fakeNgModel(),
                    u = angular.isDefined(i.readonly);
                if (c) {
                    if (c.input) throw new Error("<md-input-container> can only have *one* <input> or <textarea> child element!");
                    c.input = a, c.label || n.expect(a, "aria-label", a.attr("placeholder")), a.addClass("md-input"), a.attr("id") || a.attr("id", "input_" + e.nextUid()), "textarea" === a[0].tagName.toLowerCase() && s();
                    var p = c.isErrorGetter || function() {
                        return m.$invalid && m.$touched
                    };
                    o.$watch(p, c.setInvalid), m.$parsers.push(l), m.$formatters.push(l), a.on("input", d), u || a.on("focus", function(e) {
                        c.setFocused(!0)
                    }).on("blur", function(e) {
                        c.setFocused(!1), d()
                    }), o.$on("$destroy", function() {
                        c.setFocused(!1), c.setHasValue(!1), c.input = null
                    })
                }
            }
            return {
                restrict: "E",
                require: ["^?mdInputContainer", "?ngModel"],
                link: o
            }
        }

        function o(e) {
            function t(t, n, o, a) {
                function i(e) {
                    return s.text((n.val() || e || "").length + "/" + r), e
                }
                var r, l = a[0],
                    d = a[1],
                    s = angular.element('<div class="md-char-counter">');
                o.$set("ngTrim", "false"), d.element.append(s), l.$formatters.push(i), l.$viewChangeListeners.push(i), n.on("input keydown", function() {
                    i()
                }), t.$watch(o.mdMaxlength, function(t) {
                    r = t, angular.isNumber(t) && t > 0 ? (s.parent().length || e.enter(s, d.element, angular.element(d.element[0].lastElementChild)), i()) : e.leave(s)
                }), l.$validators["md-maxlength"] = function(e, t) {
                    return !angular.isNumber(r) || 0 > r ? !0 : (e || n.val() || t || "").length <= r
                }
            }
            return {
                restrict: "A",
                require: ["ngModel", "^mdInputContainer"],
                link: t
            }
        }

        function a() {
            function e(e, t, n, o) {
                if (o && !angular.isDefined(o.element.attr("md-no-float"))) {
                    var a = n.placeholder;
                    t.removeAttr("placeholder");
                    var i = '<div class="md-placeholder" ng-click="delegateClick()">' + a + "</div>";
                    o.element.append(i)
                }
            }
            return {
                restrict: "A",
                require: "^^?mdInputContainer",
                link: e
            }
        }
        angular.module("material.components.input", ["material.core"]).directive("mdInputContainer", e).directive("label", t).directive("input", n).directive("textarea", n).directive("mdMaxlength", o).directive("placeholder", a), e.$inject = ["$mdTheming", "$parse"], n.$inject = ["$mdUtil", "$window", "$mdAria"], o.$inject = ["$animate"]
    }(), angular.module("material.components.list", ["material.core"]).controller("MdListController", MdListController).directive("mdList", mdListDirective).directive("mdListItem", mdListItemDirective), mdListDirective.$inject = ["$mdTheming"], mdListItemDirective.$inject = ["$mdAria", "$mdConstant", "$timeout"], MdListController.$inject = ["$scope", "$element", "$mdInkRipple"], angular.module("material.components.progressCircular", ["material.core"]).directive("mdProgressCircular", MdProgressCircularDirective), MdProgressCircularDirective.$inject = ["$mdConstant", "$mdTheming"], angular.module("material.components.progressLinear", ["material.core"]).directive("mdProgressLinear", MdProgressLinearDirective), MdProgressLinearDirective.$inject = ["$$rAF", "$mdConstant", "$mdTheming"];
var transforms = function() {
    function e(e) {
        var t = e / 100,
            n = (e - 100) / 2;
        return "translateX(" + n.toString() + "%) scale(" + t.toString() + ", 1)"
    }
    for (var t = new Array(101), n = 0; 101 > n; n++) t[n] = e(n);
    return t
}();
angular.module("material.components.radioButton", ["material.core"]).directive("mdRadioGroup", mdRadioGroupDirective).directive("mdRadioButton", mdRadioButtonDirective), mdRadioGroupDirective.$inject = ["$mdUtil", "$mdConstant", "$mdTheming", "$timeout"], mdRadioButtonDirective.$inject = ["$mdAria", "$mdUtil", "$mdTheming"];
var SELECT_EDGE_MARGIN = 8,
    selectNextId = 0;
angular.module("material.components.select", ["material.core", "material.components.backdrop"]).directive("mdSelect", SelectDirective).directive("mdSelectMenu", SelectMenuDirective).directive("mdOption", OptionDirective).directive("mdOptgroup", OptgroupDirective).provider("$mdSelect", SelectProvider), SelectDirective.$inject = ["$mdSelect", "$mdUtil", "$mdTheming", "$interpolate", "$compile", "$parse"], SelectMenuDirective.$inject = ["$parse", "$mdUtil", "$mdTheming"], OptionDirective.$inject = ["$mdInkRipple", "$mdUtil"], SelectProvider.$inject = ["$$interimElementProvider"], angular.module("material.components.sidenav", ["material.core", "material.components.backdrop"]).factory("$mdSidenav", SidenavService).directive("mdSidenav", SidenavDirective).directive("mdSidenavFocus", SidenavFocusDirective).controller("$mdSidenavController", SidenavController), SidenavService.$inject = ["$mdComponentRegistry", "$q"], SidenavDirective.$inject = ["$timeout", "$animate", "$parse", "$log", "$mdMedia", "$mdConstant", "$compile", "$mdTheming", "$q", "$document"], SidenavController.$inject = ["$scope", "$element", "$attrs", "$mdComponentRegistry", "$q"], angular.module("material.components.slider", ["material.core"]).directive("mdSlider", SliderDirective), SliderDirective.$inject = ["$$rAF", "$window", "$mdAria", "$mdUtil", "$mdConstant", "$mdTheming", "$mdGesture", "$parse"], angular.module("material.components.sticky", ["material.core", "material.components.content"]).factory("$mdSticky", MdSticky), MdSticky.$inject = ["$document", "$mdConstant", "$compile", "$$rAF", "$mdUtil"], angular.module("material.components.subheader", ["material.core", "material.components.sticky"]).directive("mdSubheader", MdSubheaderDirective), MdSubheaderDirective.$inject = ["$mdSticky", "$compile", "$mdTheming"], angular.module("material.components.swipe", []).directive("mdSwipeLeft", getDirective("SwipeLeft")).directive("mdSwipeRight", getDirective("SwipeRight")), angular.module("material.components.switch", ["material.core", "material.components.checkbox"]).directive("mdSwitch", MdSwitch), MdSwitch.$inject = ["mdCheckboxDirective", "$mdTheming", "$mdUtil", "$document", "$mdConstant", "$parse", "$$rAF", "$mdGesture"], angular.module("material.components.tabs", ["material.core", "material.components.icon"]), angular.module("material.components.toast", ["material.core", "material.components.button"]).directive("mdToast", MdToastDirective).provider("$mdToast", MdToastProvider), MdToastProvider.$inject = ["$$interimElementProvider"], angular.module("material.components.toolbar", ["material.core", "material.components.content"]).directive("mdToolbar", mdToolbarDirective), mdToolbarDirective.$inject = ["$$rAF", "$mdConstant", "$mdUtil", "$mdTheming"], angular.module("material.components.tooltip", ["material.core"]).directive("mdTooltip", MdTooltipDirective), MdTooltipDirective.$inject = ["$timeout", "$window", "$$rAF", "$document", "$mdUtil", "$mdTheming", "$rootElement", "$animate", "$q"], angular.module("material.components.whiteframe", []), angular.module("material.components.autocomplete").controller("MdAutocompleteCtrl", MdAutocompleteCtrl);
var ITEM_HEIGHT = 41,
    MAX_HEIGHT = 5.5 * ITEM_HEIGHT,
    MENU_PADDING = 8;
MdAutocompleteCtrl.$inject = ["$scope", "$element", "$mdUtil", "$mdConstant", "$timeout", "$mdTheming", "$window", "$rootElement"], angular.module("material.components.autocomplete").directive("mdAutocomplete", MdAutocomplete), MdAutocomplete.$inject = ["$mdTheming"], angular.module("material.components.autocomplete").controller("MdHighlightCtrl", MdHighlightCtrl), MdHighlightCtrl.$inject = ["$scope", "$element", "$interpolate"], angular.module("material.components.autocomplete").directive("mdHighlightText", MdHighlight), angular.module("material.components.autocomplete").directive("mdAutocompleteListItem", MdAutocompleteListItem), MdAutocompleteListItem.$inject = ["$compile", "$mdUtil"], angular.module("material.components.chips").directive("mdChip", MdChip);
var DELETE_HINT_TEMPLATE = '    <span ng-if="!$mdChipsCtrl.readonly" class="md-visually-hidden">      {{$mdChipsCtrl.deleteHint}}    </span>';
MdChip.$inject = ["$mdTheming"], angular.module("material.components.chips").directive("mdChipRemove", MdChipRemove), MdChipRemove.$inject = ["$timeout"], angular.module("material.components.chips").directive("mdChipTransclude", MdChipTransclude), MdChipTransclude.$inject = ["$compile", "$mdUtil"], angular.module("material.components.chips").controller("MdChipsCtrl", MdChipsCtrl), MdChipsCtrl.$inject = ["$scope", "$mdConstant", "$log", "$element", "$timeout"], MdChipsCtrl.prototype.inputKeydown = function(e) {
    var t = this.getChipBuffer();
    switch (e.keyCode) {
        case this.$mdConstant.KEY_CODE.ENTER:
            if (this.$scope.requireMatch || !t) break;
            e.preventDefault(), this.appendChip(t), this.resetChipBuffer();
            break;
        case this.$mdConstant.KEY_CODE.BACKSPACE:
            if (t) break;
            e.stopPropagation(), this.items.length && this.selectAndFocusChipSafe(this.items.length - 1)
    }
}, MdChipsCtrl.prototype.chipKeydown = function(e) {
    if (!this.getChipBuffer()) switch (e.keyCode) {
        case this.$mdConstant.KEY_CODE.BACKSPACE:
        case this.$mdConstant.KEY_CODE.DELETE:
            if (this.selectedChip < 0) return;
            e.preventDefault(), this.removeAndSelectAdjacentChip(this.selectedChip);
            break;
        case this.$mdConstant.KEY_CODE.LEFT_ARROW:
            e.preventDefault(), this.selectedChip < 0 && (this.selectedChip = this.items.length), this.items.length && this.selectAndFocusChipSafe(this.selectedChip - 1);
            break;
        case this.$mdConstant.KEY_CODE.RIGHT_ARROW:
            e.preventDefault(), this.selectAndFocusChipSafe(this.selectedChip + 1);
            break;
        case this.$mdConstant.KEY_CODE.ESCAPE:
        case this.$mdConstant.KEY_CODE.TAB:
            if (this.selectedChip < 0) return;
            e.preventDefault(), this.onFocus()
    }
}, MdChipsCtrl.prototype.getPlaceholder = function() {
    var e = this.items.length && ("" == this.secondaryPlaceholder || this.secondaryPlaceholder);
    return e ? this.placeholder : this.secondaryPlaceholder
}, MdChipsCtrl.prototype.removeAndSelectAdjacentChip = function(e) {
    var t = this.getAdjacentChipIndex(e);
    this.removeChip(e), this.$timeout(function() {
        this.selectAndFocusChipSafe(t)
    }.bind(this))
}, MdChipsCtrl.prototype.resetSelectedChip = function() {
    this.selectedChip = -1
}, MdChipsCtrl.prototype.getAdjacentChipIndex = function(e) {
    var t = this.items.length - 1;
    return 0 == t ? -1 : e == t ? e - 1 : e
}, MdChipsCtrl.prototype.appendChip = function(e) {
    this.items.indexOf(e) + 1 || (this.useMdOnAppend && this.mdOnAppend && (e = this.mdOnAppend({
        $chip: e
    })), this.items.push(e))
}, MdChipsCtrl.prototype.useMdOnAppendExpression = function() {
    this.useMdOnAppend = !0
}, MdChipsCtrl.prototype.getChipBuffer = function() {
    return this.userInputElement ? this.userInputNgModelCtrl ? this.userInputNgModelCtrl.$viewValue : this.userInputElement[0].value : this.chipBuffer
}, MdChipsCtrl.prototype.resetChipBuffer = function() {
    this.userInputElement ? this.userInputNgModelCtrl ? (this.userInputNgModelCtrl.$setViewValue(""), this.userInputNgModelCtrl.$render()) : this.userInputElement[0].value = "" : this.chipBuffer = ""
}, MdChipsCtrl.prototype.removeChip = function(e) {
    this.items.splice(e, 1)
}, MdChipsCtrl.prototype.removeChipAndFocusInput = function(e) {
    this.removeChip(e), this.onFocus()
}, MdChipsCtrl.prototype.selectAndFocusChipSafe = function(e) {
    return this.items.length ? e === this.items.length ? this.onFocus() : (e = Math.max(e, 0), e = Math.min(e, this.items.length - 1), this.selectChip(e), void this.focusChip(e)) : (this.selectChip(-1), void this.onFocus())
}, MdChipsCtrl.prototype.selectChip = function(e) {
    e >= -1 && e <= this.items.length ? this.selectedChip = e : this.$log.warn("Selected Chip index out of bounds; ignoring.")
}, MdChipsCtrl.prototype.selectAndFocusChip = function(e) {
    this.selectChip(e), -1 != e && this.focusChip(e)
}, MdChipsCtrl.prototype.focusChip = function(e) {
    this.$element[0].querySelector('md-chip[index="' + e + '"] .md-chip-content').focus()
}, MdChipsCtrl.prototype.configureNgModel = function(e) {
    this.ngModelCtrl = e;
    var t = this;
    e.$render = function() {
        t.items = t.ngModelCtrl.$viewValue
    }
}, MdChipsCtrl.prototype.onFocus = function() {
    var e = this.$element[0].querySelector("input");
    e && e.focus(), this.resetSelectedChip()
}, MdChipsCtrl.prototype.onInputFocus = function() {
    this.inputHasFocus = !0, this.resetSelectedChip()
}, MdChipsCtrl.prototype.onInputBlur = function() {
    this.inputHasFocus = !1
}, MdChipsCtrl.prototype.configureUserInput = function(e) {
    this.userInputElement = e;
    var t = e.controller("ngModel");
    t != this.ngModelCtrl && (this.userInputNgModelCtrl = t);
    var n = this.$scope,
        o = this;
    e.attr({
        tabindex: 0
    }).on("keydown", function(e) {
        n.$apply(function() {
            o.inputKeydown(e)
        })
    }).on("focus", function() {
        this.$scope.$apply(this.onInputFocus.bind(this))
    }.bind(this)).on("blur", function() {
        this.$scope.$apply(this.onInputBlur.bind(this))
    }.bind(this))
}, MdChipsCtrl.prototype.configureAutocomplete = function(e) {
    e.registerSelectedItemWatcher(function(e) {
        e && (this.appendChip(e), this.resetChipBuffer())
    }.bind(this)), this.$element.find("input").on("focus", function() {
        this.$scope.$apply(this.onInputFocus.bind(this))
    }.bind(this)).on("blur", function() {
        this.$scope.$apply(this.onInputBlur.bind(this))
    }.bind(this))
}, MdChipsCtrl.prototype.hasFocus = function() {
    return this.inputHasFocus || this.selectedChip >= 0
}, angular.module("material.components.chips").directive("mdChips", MdChips);
var MD_CHIPS_TEMPLATE = '    <md-chips-wrap        ng-if="!$mdChipsCtrl.readonly || $mdChipsCtrl.items.length > 0"        ng-keydown="$mdChipsCtrl.chipKeydown($event)"        ng-class="{ \'md-focused\': $mdChipsCtrl.hasFocus() }"        class="md-chips">      <md-chip ng-repeat="$chip in $mdChipsCtrl.items"          index="{{$index}}"          ng-class="{\'md-focused\': $mdChipsCtrl.selectedChip == $index}">        <div class="md-chip-content"            tabindex="-1"            aria-hidden="true"            ng-focus="!$mdChipsCtrl.readonly && $mdChipsCtrl.selectChip($index)"            md-chip-transclude="$mdChipsCtrl.chipContentsTemplate"></div>        <div class="md-chip-remove-container"            md-chip-transclude="$mdChipsCtrl.chipRemoveTemplate"></div>      </md-chip>      <div ng-if="!$mdChipsCtrl.readonly && $mdChipsCtrl.ngModelCtrl"          class="md-chip-input-container"          md-chip-transclude="$mdChipsCtrl.chipInputTemplate"></div>      </div>    </md-chips-wrap>',
    CHIP_INPUT_TEMPLATE = '      <input          tabindex="0"          placeholder="{{$mdChipsCtrl.getPlaceholder()}}"          aria-label="{{$mdChipsCtrl.getPlaceholder()}}"          ng-model="$mdChipsCtrl.chipBuffer"          ng-focus="$mdChipsCtrl.onInputFocus()"          ng-blur="$mdChipsCtrl.onInputBlur()"          ng-keydown="$mdChipsCtrl.inputKeydown($event)">',
    CHIP_DEFAULT_TEMPLATE = "    <span>{{$chip}}</span>",
    CHIP_REMOVE_TEMPLATE = '    <button        class="md-chip-remove"        ng-if="!$mdChipsCtrl.readonly"        ng-click="$mdChipsCtrl.removeChipAndFocusInput($$replacedScope.$index)"        aria-hidden="true"        tabindex="-1">      <md-icon md-svg-icon="close"></md-icon>      <span class="md-visually-hidden">        {{$mdChipsCtrl.deleteButtonLabel}}      </span>    </button>';
MdChips.$inject = ["$mdTheming", "$compile", "$timeout"], angular.module("material.components.chips").controller("MdContactChipsCtrl", MdContactChipsCtrl), MdContactChipsCtrl.prototype.queryContact = function(e) {
    var t = this.contactQuery({
        $query: e
    });
    return this.filterSelected ? t.filter(this.filterSelectedContacts.bind(this)) : t
}, MdContactChipsCtrl.prototype.filterSelectedContacts = function(e) {
    return -1 == this.contacts.indexOf(e)
}, angular.module("material.components.chips").directive("mdContactChips", MdContactChips);
var MD_CONTACT_CHIPS_TEMPLATE = '    <md-chips class="md-contact-chips"        ng-model="$mdContactChipsCtrl.contacts"        md-require-match="$mdContactChipsCtrl.requireMatch"        md-autocomplete-snap>        <md-autocomplete            md-menu-class="md-contact-chips-suggestions"            md-selected-item="$mdContactChipsCtrl.selectedItem"            md-search-text="$mdContactChipsCtrl.searchText"            md-items="item in $mdContactChipsCtrl.queryContact($mdContactChipsCtrl.searchText)"            md-item-text="$mdContactChipsCtrl.mdContactName"            md-no-cache="$mdContactChipsCtrl.filterSelected"            md-autoselect            placeholder="{{$mdContactChipsCtrl.contacts.length == 0 ?                $mdContactChipsCtrl.placeholder : $mdContactChipsCtrl.secondaryPlaceholder}}">          <div class="md-contact-suggestion">            <img                 ng-src="{{item[$mdContactChipsCtrl.contactImage]}}"                alt="{{item[$mdContactChipsCtrl.contactName]}}" />            <span class="md-contact-name" md-highlight-text="$mdContactChipsCtrl.searchText">              {{item[$mdContactChipsCtrl.contactName]}}            </span>            <span class="md-contact-email" >{{item[$mdContactChipsCtrl.contactEmail]}}</span>          </div>        </md-autocomplete>        <md-chip-template>          <div class="md-contact-avatar">            <img                 ng-src="{{$chip[$mdContactChipsCtrl.contactImage]}}"                alt="{{$chip[$mdContactChipsCtrl.contactName]}}" />          </div>          <div class="md-contact-name">            {{$chip[$mdContactChipsCtrl.contactName]}}          </div>        </md-chip-template>    </md-chips>';
MdContactChips.$inject = ["$mdTheming"], angular.module("material.components.tabs").directive("mdTab", MdTab), angular.module("material.components.tabs").directive("mdTabItem", MdTabItem), angular.module("material.components.tabs").directive("mdTabScroll", MdTabScroll), MdTabScroll.$inject = ["$parse"], angular.module("material.components.tabs").controller("MdTabsController", MdTabsController), MdTabsController.$inject = ["$scope", "$element", "$window", "$timeout", "$mdConstant", "$mdInkRipple", "$mdUtil", "$animate"], angular.module("material.components.tabs").directive("mdTabs", MdTabs), MdTabs.$inject = ["$mdTheming"], angular.module("material.components.tabs").directive("mdTemplate", MdTemplate), MdTemplate.$inject = ["$compile"],
    function() {
        angular.module("material.core").constant("$MD_THEME_CSS", "/* mixin definition ; sets LTR and RTL within the same style call */md-autocomplete.md-THEME_NAME-theme {  background: '{{background-50}}'; }  md-autocomplete.md-THEME_NAME-theme button md-icon path {    fill: '{{background-600}}'; }  md-autocomplete.md-THEME_NAME-theme button:after {    background: '{{background-600-0.3}}'; }.md-autocomplete-suggestions.md-THEME_NAME-theme {  background: '{{background-50}}'; }  .md-autocomplete-suggestions.md-THEME_NAME-theme li {    border-top: 1px solid '{{background-300}}';    color: '{{background-900}}'; }    .md-autocomplete-suggestions.md-THEME_NAME-theme li .highlight {      color: '{{background-600}}'; }    .md-autocomplete-suggestions.md-THEME_NAME-theme li:hover, .md-autocomplete-suggestions.md-THEME_NAME-theme li.selected {      background: '{{background-200}}'; }md-backdrop.md-opaque.md-THEME_NAME-theme {  background-color: '{{foreground-4-0.5}}'; }md-bottom-sheet.md-THEME_NAME-theme {  background-color: '{{background-50}}';  border-top-color: '{{background-300}}'; }  md-bottom-sheet.md-THEME_NAME-theme.md-list md-item {    color: '{{foreground-1}}'; }  md-bottom-sheet.md-THEME_NAME-theme .md-subheader {    background-color: '{{background-50}}'; }  md-bottom-sheet.md-THEME_NAME-theme .md-subheader {    color: '{{foreground-1}}'; }a.md-button.md-THEME_NAME-theme, .md-button.md-THEME_NAME-theme {  border-radius: 3px; }  a.md-button.md-THEME_NAME-theme:not([disabled]):hover, .md-button.md-THEME_NAME-theme:not([disabled]):hover {    background-color: '{{background-500-0.2}}'; }  a.md-button.md-THEME_NAME-theme:not([disabled]).md-focused, .md-button.md-THEME_NAME-theme:not([disabled]).md-focused {    background-color: '{{background-500-0.2}}'; }  a.md-button.md-THEME_NAME-theme:not([disabled]).md-icon-button:hover, .md-button.md-THEME_NAME-theme:not([disabled]).md-icon-button:hover {    background-color: transparent; }  a.md-button.md-THEME_NAME-theme.md-fab, .md-button.md-THEME_NAME-theme.md-fab {    border-radius: 50%;    background-color: '{{accent-color}}';    color: '{{accent-contrast}}'; }    a.md-button.md-THEME_NAME-theme.md-fab md-icon, .md-button.md-THEME_NAME-theme.md-fab md-icon {      color: '{{accent-contrast}}'; }    a.md-button.md-THEME_NAME-theme.md-fab:not([disabled]):hover, .md-button.md-THEME_NAME-theme.md-fab:not([disabled]):hover {      background-color: '{{accent-color}}'; }    a.md-button.md-THEME_NAME-theme.md-fab:not([disabled]).md-focused, .md-button.md-THEME_NAME-theme.md-fab:not([disabled]).md-focused {      background-color: '{{accent-A700}}'; }  a.md-button.md-THEME_NAME-theme.md-primary, .md-button.md-THEME_NAME-theme.md-primary {    color: '{{primary-color}}'; }    a.md-button.md-THEME_NAME-theme.md-primary.md-raised, a.md-button.md-THEME_NAME-theme.md-primary.md-fab, .md-button.md-THEME_NAME-theme.md-primary.md-raised, .md-button.md-THEME_NAME-theme.md-primary.md-fab {      color: '{{primary-contrast}}';      background-color: '{{primary-color}}'; }      a.md-button.md-THEME_NAME-theme.md-primary.md-raised md-icon, a.md-button.md-THEME_NAME-theme.md-primary.md-fab md-icon, .md-button.md-THEME_NAME-theme.md-primary.md-raised md-icon, .md-button.md-THEME_NAME-theme.md-primary.md-fab md-icon {        color: '{{primary-contrast}}'; }      a.md-button.md-THEME_NAME-theme.md-primary.md-raised:not([disabled]):hover, a.md-button.md-THEME_NAME-theme.md-primary.md-fab:not([disabled]):hover, .md-button.md-THEME_NAME-theme.md-primary.md-raised:not([disabled]):hover, .md-button.md-THEME_NAME-theme.md-primary.md-fab:not([disabled]):hover {        background-color: '{{primary-color}}'; }      a.md-button.md-THEME_NAME-theme.md-primary.md-raised:not([disabled]).md-focused, a.md-button.md-THEME_NAME-theme.md-primary.md-fab:not([disabled]).md-focused, .md-button.md-THEME_NAME-theme.md-primary.md-raised:not([disabled]).md-focused, .md-button.md-THEME_NAME-theme.md-primary.md-fab:not([disabled]).md-focused {        background-color: '{{primary-600}}'; }  a.md-button.md-THEME_NAME-theme.md-fab, .md-button.md-THEME_NAME-theme.md-fab {    border-radius: 50%;    background-color: '{{accent-color}}';    color: '{{accent-contrast}}'; }    a.md-button.md-THEME_NAME-theme.md-fab:not([disabled]):hover, .md-button.md-THEME_NAME-theme.md-fab:not([disabled]):hover {      background-color: '{{accent-color}}'; }    a.md-button.md-THEME_NAME-theme.md-fab:not([disabled]).md-focused, .md-button.md-THEME_NAME-theme.md-fab:not([disabled]).md-focused {      background-color: '{{accent-A700}}'; }  a.md-button.md-THEME_NAME-theme.md-raised, .md-button.md-THEME_NAME-theme.md-raised {    color: '{{background-contrast}}';    background-color: '{{background-50}}'; }    a.md-button.md-THEME_NAME-theme.md-raised:not([disabled]):hover, .md-button.md-THEME_NAME-theme.md-raised:not([disabled]):hover {      background-color: '{{background-50}}'; }    a.md-button.md-THEME_NAME-theme.md-raised:not([disabled]).md-focused, .md-button.md-THEME_NAME-theme.md-raised:not([disabled]).md-focused {      background-color: '{{background-200}}'; }  a.md-button.md-THEME_NAME-theme.md-warn, .md-button.md-THEME_NAME-theme.md-warn {    color: '{{warn-color}}'; }    a.md-button.md-THEME_NAME-theme.md-warn.md-raised, a.md-button.md-THEME_NAME-theme.md-warn.md-fab, .md-button.md-THEME_NAME-theme.md-warn.md-raised, .md-button.md-THEME_NAME-theme.md-warn.md-fab {      color: '{{warn-contrast}}';      background-color: '{{warn-color}}'; }      a.md-button.md-THEME_NAME-theme.md-warn.md-raised md-icon, a.md-button.md-THEME_NAME-theme.md-warn.md-fab md-icon, .md-button.md-THEME_NAME-theme.md-warn.md-raised md-icon, .md-button.md-THEME_NAME-theme.md-warn.md-fab md-icon {        color: '{{warn-contrast}}'; }      a.md-button.md-THEME_NAME-theme.md-warn.md-raised:not([disabled]):hover, a.md-button.md-THEME_NAME-theme.md-warn.md-fab:not([disabled]):hover, .md-button.md-THEME_NAME-theme.md-warn.md-raised:not([disabled]):hover, .md-button.md-THEME_NAME-theme.md-warn.md-fab:not([disabled]):hover {        background-color: '{{warn-color}}'; }      a.md-button.md-THEME_NAME-theme.md-warn.md-raised:not([disabled]).md-focused, a.md-button.md-THEME_NAME-theme.md-warn.md-fab:not([disabled]).md-focused, .md-button.md-THEME_NAME-theme.md-warn.md-raised:not([disabled]).md-focused, .md-button.md-THEME_NAME-theme.md-warn.md-fab:not([disabled]).md-focused {        background-color: '{{warn-700}}'; }  a.md-button.md-THEME_NAME-theme.md-accent, .md-button.md-THEME_NAME-theme.md-accent {    color: '{{accent-color}}'; }    a.md-button.md-THEME_NAME-theme.md-accent.md-raised, a.md-button.md-THEME_NAME-theme.md-accent.md-fab, .md-button.md-THEME_NAME-theme.md-accent.md-raised, .md-button.md-THEME_NAME-theme.md-accent.md-fab {      color: '{{accent-contrast}}';      background-color: '{{accent-color}}'; }      a.md-button.md-THEME_NAME-theme.md-accent.md-raised md-icon, a.md-button.md-THEME_NAME-theme.md-accent.md-fab md-icon, .md-button.md-THEME_NAME-theme.md-accent.md-raised md-icon, .md-button.md-THEME_NAME-theme.md-accent.md-fab md-icon {        color: '{{accent-contrast}}'; }      a.md-button.md-THEME_NAME-theme.md-accent.md-raised:not([disabled]):hover, a.md-button.md-THEME_NAME-theme.md-accent.md-fab:not([disabled]):hover, .md-button.md-THEME_NAME-theme.md-accent.md-raised:not([disabled]):hover, .md-button.md-THEME_NAME-theme.md-accent.md-fab:not([disabled]):hover {        background-color: '{{accent-color}}'; }      a.md-button.md-THEME_NAME-theme.md-accent.md-raised:not([disabled]).md-focused, a.md-button.md-THEME_NAME-theme.md-accent.md-fab:not([disabled]).md-focused, .md-button.md-THEME_NAME-theme.md-accent.md-raised:not([disabled]).md-focused, .md-button.md-THEME_NAME-theme.md-accent.md-fab:not([disabled]).md-focused {        background-color: '{{accent-700}}'; }  a.md-button.md-THEME_NAME-theme[disabled], a.md-button.md-THEME_NAME-theme.md-raised[disabled], a.md-button.md-THEME_NAME-theme.md-fab[disabled], .md-button.md-THEME_NAME-theme[disabled], .md-button.md-THEME_NAME-theme.md-raised[disabled], .md-button.md-THEME_NAME-theme.md-fab[disabled] {    color: '{{foreground-2}}';    cursor: not-allowed; }    a.md-button.md-THEME_NAME-theme[disabled] md-icon, a.md-button.md-THEME_NAME-theme.md-raised[disabled] md-icon, a.md-button.md-THEME_NAME-theme.md-fab[disabled] md-icon, .md-button.md-THEME_NAME-theme[disabled] md-icon, .md-button.md-THEME_NAME-theme.md-raised[disabled] md-icon, .md-button.md-THEME_NAME-theme.md-fab[disabled] md-icon {      color: '{{foreground-2}}'; }  a.md-button.md-THEME_NAME-theme.md-raised[disabled], a.md-button.md-THEME_NAME-theme.md-fab[disabled], .md-button.md-THEME_NAME-theme.md-raised[disabled], .md-button.md-THEME_NAME-theme.md-fab[disabled] {    background-color: '{{foreground-4}}'; }  a.md-button.md-THEME_NAME-theme[disabled], .md-button.md-THEME_NAME-theme[disabled] {    background-color: 'transparent'; }md-card.md-THEME_NAME-theme {  background-color: '{{background-color}}';  border-radius: 2px; }  md-card.md-THEME_NAME-theme .md-card-image {    border-radius: 2px 2px 0 0; }md-checkbox.md-THEME_NAME-theme .md-ripple {  color: '{{accent-600}}'; }md-checkbox.md-THEME_NAME-theme.md-checked .md-ripple {  color: '{{background-600}}'; }md-checkbox.md-THEME_NAME-theme.md-checked.md-focused .md-container:before {  background-color: '{{accent-color-0.26}}'; }md-checkbox.md-THEME_NAME-theme .md-icon {  border-color: '{{foreground-2}}'; }md-checkbox.md-THEME_NAME-theme.md-checked .md-icon {  background-color: '{{accent-color-0.87}}'; }md-checkbox.md-THEME_NAME-theme.md-checked .md-icon:after {  border-color: '{{background-200}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary .md-ripple {  color: '{{primary-600}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-ripple {  color: '{{background-600}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary .md-icon {  border-color: '{{foreground-2}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-icon {  background-color: '{{primary-color-0.87}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked.md-focused .md-container:before {  background-color: '{{primary-color-0.26}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-icon:after {  border-color: '{{background-200}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn .md-ripple {  color: '{{warn-600}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn .md-icon {  border-color: '{{foreground-2}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-icon {  background-color: '{{warn-color-0.87}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked.md-focused:not([disabled]) .md-container:before {  background-color: '{{warn-color-0.26}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-icon:after {  border-color: '{{background-200}}'; }md-checkbox.md-THEME_NAME-theme[disabled] .md-icon {  border-color: '{{foreground-3}}'; }md-checkbox.md-THEME_NAME-theme[disabled].md-checked .md-icon {  background-color: '{{foreground-3}}'; }md-checkbox.md-THEME_NAME-theme[disabled] .md-label {  color: '{{foreground-3}}'; }md-chips.md-THEME_NAME-theme .md-chips {  box-shadow: 0 1px '{{background-300}}'; }  md-chips.md-THEME_NAME-theme .md-chips.md-focused {    box-shadow: 0 2px '{{primary-color}}'; }md-chips.md-THEME_NAME-theme .md-chip {  background: '{{background-300}}';  color: '{{background-800}}'; }  md-chips.md-THEME_NAME-theme .md-chip.md-focused {    background: '{{primary-color}}';    color: '{{primary-contrast}}'; }    md-chips.md-THEME_NAME-theme .md-chip.md-focused md-icon {      color: '{{primary-contrast}}'; }md-chips.md-THEME_NAME-theme md-chip-remove .md-button md-icon path {  fill: '{{background-500}}'; }.md-contact-suggestion span.md-contact-email {  color: '{{background-400}}'; }md-content.md-THEME_NAME-theme {  background-color: '{{background-color}}'; }md-dialog.md-THEME_NAME-theme {  border-radius: 4px;  background-color: '{{background-color}}'; }  md-dialog.md-THEME_NAME-theme.md-content-overflow .md-actions {    border-top-color: '{{foreground-4}}'; }md-divider.md-THEME_NAME-theme {  border-top-color: '{{foreground-4}}'; }md-icon.md-THEME_NAME-theme {  color: '{{foreground-2}}'; }  md-icon.md-THEME_NAME-theme.md-primary {    color: '{{primary-color}}'; }  md-icon.md-THEME_NAME-theme.md-accent {    color: '{{accent-color}}'; }  md-icon.md-THEME_NAME-theme.md-warn {    color: '{{warn-color}}'; }md-input-container.md-THEME_NAME-theme .md-input {  color: '{{foreground-1}}';  border-color: '{{foreground-4}}';  text-shadow: '{{foreground-shadow}}'; }  md-input-container.md-THEME_NAME-theme .md-input::-webkit-input-placeholder, md-input-container.md-THEME_NAME-theme .md-input::-moz-placeholder, md-input-container.md-THEME_NAME-theme .md-input:-moz-placeholder, md-input-container.md-THEME_NAME-theme .md-input:-ms-input-placeholder {    color: '{{foreground-3}}'; }md-input-container.md-THEME_NAME-theme > md-icon {  color: '{{foreground-1}}'; }md-input-container.md-THEME_NAME-theme label, md-input-container.md-THEME_NAME-theme .md-placeholder {  text-shadow: '{{foreground-shadow}}';  color: '{{foreground-3}}'; }md-input-container.md-THEME_NAME-theme ng-messages, md-input-container.md-THEME_NAME-theme [ng-message], md-input-container.md-THEME_NAME-theme [data-ng-message], md-input-container.md-THEME_NAME-theme [x-ng-message] {  color: '{{warn-500}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-has-value label {  color: '{{foreground-2}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused .md-input {  border-color: '{{primary-500}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused label {  color: '{{primary-500}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused md-icon {  color: '{{primary-500}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-accent .md-input {  border-color: '{{accent-500}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-accent label {  color: '{{accent-500}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-warn .md-input {  border-color: '{{warn-500}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-warn label {  color: '{{warn-500}}'; }md-input-container.md-THEME_NAME-theme.md-input-invalid .md-input {  border-color: '{{warn-500}}'; }md-input-container.md-THEME_NAME-theme.md-input-invalid.md-input-focused label {  color: '{{warn-500}}'; }md-input-container.md-THEME_NAME-theme.md-input-invalid ng-message, md-input-container.md-THEME_NAME-theme.md-input-invalid data-ng-message, md-input-container.md-THEME_NAME-theme.md-input-invalid x-ng-message, md-input-container.md-THEME_NAME-theme.md-input-invalid [ng-message], md-input-container.md-THEME_NAME-theme.md-input-invalid [data-ng-message], md-input-container.md-THEME_NAME-theme.md-input-invalid [x-ng-message], md-input-container.md-THEME_NAME-theme.md-input-invalid .md-char-counter {  color: '{{warn-500}}'; }md-input-container.md-THEME_NAME-theme .md-input[disabled], [disabled] md-input-container.md-THEME_NAME-theme .md-input {  border-bottom-color: transparent;  color: '{{foreground-3}}';  background-image: linear-gradient(to right, '{{foreground-4}}' 0%, '{{foreground-4}}' 33%, transparent 0%);  background-image: -ms-linear-gradient(left, transparent 0%, '{{foreground-4}}' 100%); }md-list.md-THEME_NAME-theme md-list-item.md-2-line .md-list-item-text h3, md-list.md-THEME_NAME-theme md-list-item.md-2-line .md-list-item-text h4, md-list.md-THEME_NAME-theme md-list-item.md-3-line .md-list-item-text h3, md-list.md-THEME_NAME-theme md-list-item.md-3-line .md-list-item-text h4 {  color: '{{foreground-1}}'; }md-list.md-THEME_NAME-theme md-list-item.md-2-line .md-list-item-text p, md-list.md-THEME_NAME-theme md-list-item.md-3-line .md-list-item-text p {  color: '{{foreground-2}}'; }md-list.md-THEME_NAME-theme .md-proxy-focus.md-focused div.md-no-style {  background-color: '{{background-100}}'; }md-list.md-THEME_NAME-theme md-list-item > md-icon {  color: '{{foreground-2}}'; }  md-list.md-THEME_NAME-theme md-list-item > md-icon.md-highlight {    color: '{{primary-color}}'; }    md-list.md-THEME_NAME-theme md-list-item > md-icon.md-highlight.md-accent {      color: '{{accent-color}}'; }md-list.md-THEME_NAME-theme md-list-item button {  background-color: '{{background-color}}'; }  md-list.md-THEME_NAME-theme md-list-item button.md-button:not([disabled]):hover {    background-color: '{{background-color}}'; }md-progress-circular.md-THEME_NAME-theme {  background-color: transparent; }  md-progress-circular.md-THEME_NAME-theme .md-inner .md-gap {    border-top-color: '{{primary-color}}';    border-bottom-color: '{{primary-color}}'; }  md-progress-circular.md-THEME_NAME-theme .md-inner .md-left .md-half-circle, md-progress-circular.md-THEME_NAME-theme .md-inner .md-right .md-half-circle {    border-top-color: '{{primary-color}}'; }  md-progress-circular.md-THEME_NAME-theme .md-inner .md-right .md-half-circle {    border-right-color: '{{primary-color}}'; }  md-progress-circular.md-THEME_NAME-theme .md-inner .md-left .md-half-circle {    border-left-color: '{{primary-color}}'; }  md-progress-circular.md-THEME_NAME-theme.md-warn .md-inner .md-gap {    border-top-color: '{{warn-color}}';    border-bottom-color: '{{warn-color}}'; }  md-progress-circular.md-THEME_NAME-theme.md-warn .md-inner .md-left .md-half-circle, md-progress-circular.md-THEME_NAME-theme.md-warn .md-inner .md-right .md-half-circle {    border-top-color: '{{warn-color}}'; }  md-progress-circular.md-THEME_NAME-theme.md-warn .md-inner .md-right .md-half-circle {    border-right-color: '{{warn-color}}'; }  md-progress-circular.md-THEME_NAME-theme.md-warn .md-inner .md-left .md-half-circle {    border-left-color: '{{warn-color}}'; }  md-progress-circular.md-THEME_NAME-theme.md-accent .md-inner .md-gap {    border-top-color: '{{accent-color}}';    border-bottom-color: '{{accent-color}}'; }  md-progress-circular.md-THEME_NAME-theme.md-accent .md-inner .md-left .md-half-circle, md-progress-circular.md-THEME_NAME-theme.md-accent .md-inner .md-right .md-half-circle {    border-top-color: '{{accent-color}}'; }  md-progress-circular.md-THEME_NAME-theme.md-accent .md-inner .md-right .md-half-circle {    border-right-color: '{{accent-color}}'; }  md-progress-circular.md-THEME_NAME-theme.md-accent .md-inner .md-left .md-half-circle {    border-left-color: '{{accent-color}}'; }md-progress-linear.md-THEME_NAME-theme .md-container {  background-color: '{{primary-100}}'; }md-progress-linear.md-THEME_NAME-theme .md-bar {  background-color: '{{primary-color}}'; }md-progress-linear.md-THEME_NAME-theme.md-warn .md-container {  background-color: '{{warn-100}}'; }md-progress-linear.md-THEME_NAME-theme.md-warn .md-bar {  background-color: '{{warn-color}}'; }md-progress-linear.md-THEME_NAME-theme.md-accent .md-container {  background-color: '{{accent-100}}'; }md-progress-linear.md-THEME_NAME-theme.md-accent .md-bar {  background-color: '{{accent-color}}'; }md-progress-linear.md-THEME_NAME-theme[md-mode=buffer].md-warn .md-bar1 {  background-color: '{{warn-100}}'; }md-progress-linear.md-THEME_NAME-theme[md-mode=buffer].md-warn .md-dashed:before {  background: radial-gradient('{{warn-100}}' 0%, '{{warn-100}}' 16%, transparent 42%); }md-progress-linear.md-THEME_NAME-theme[md-mode=buffer].md-accent .md-bar1 {  background-color: '{{accent-100}}'; }md-progress-linear.md-THEME_NAME-theme[md-mode=buffer].md-accent .md-dashed:before {  background: radial-gradient('{{accent-100}}' 0%, '{{accent-100}}' 16%, transparent 42%); }md-radio-button.md-THEME_NAME-theme .md-off {  border-color: '{{foreground-2}}'; }md-radio-button.md-THEME_NAME-theme .md-on {  background-color: '{{accent-color-0.87}}'; }md-radio-button.md-THEME_NAME-theme.md-checked .md-off {  border-color: '{{accent-color-0.87}}'; }md-radio-button.md-THEME_NAME-theme.md-checked .md-ink-ripple {  color: '{{accent-color-0.87}}'; }md-radio-button.md-THEME_NAME-theme .md-container .md-ripple {  color: '{{accent-600}}'; }md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-primary .md-on, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-primary .md-on, md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-primary .md-on, md-radio-button.md-THEME_NAME-theme:not([disabled]).md-primary .md-on {  background-color: '{{primary-color-0.87}}'; }md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-primary .md-checked .md-off, md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-primary.md-checked .md-off, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-primary .md-checked .md-off, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-off, md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-primary .md-checked .md-off, md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-primary.md-checked .md-off, md-radio-button.md-THEME_NAME-theme:not([disabled]).md-primary .md-checked .md-off, md-radio-button.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-off {  border-color: '{{primary-color-0.87}}'; }md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-primary .md-checked .md-ink-ripple, md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-primary.md-checked .md-ink-ripple, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-primary .md-checked .md-ink-ripple, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-ink-ripple, md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-primary .md-checked .md-ink-ripple, md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-primary.md-checked .md-ink-ripple, md-radio-button.md-THEME_NAME-theme:not([disabled]).md-primary .md-checked .md-ink-ripple, md-radio-button.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-ink-ripple {  color: '{{primary-color-0.87}}'; }md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-primary .md-container .md-ripple, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-primary .md-container .md-ripple, md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-primary .md-container .md-ripple, md-radio-button.md-THEME_NAME-theme:not([disabled]).md-primary .md-container .md-ripple {  color: '{{primary-600}}'; }md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-warn .md-on, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-warn .md-on, md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-warn .md-on, md-radio-button.md-THEME_NAME-theme:not([disabled]).md-warn .md-on {  background-color: '{{warn-color-0.87}}'; }md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-warn .md-checked .md-off, md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-warn.md-checked .md-off, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-warn .md-checked .md-off, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-off, md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-warn .md-checked .md-off, md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-warn.md-checked .md-off, md-radio-button.md-THEME_NAME-theme:not([disabled]).md-warn .md-checked .md-off, md-radio-button.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-off {  border-color: '{{warn-color-0.87}}'; }md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-warn .md-checked .md-ink-ripple, md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-warn.md-checked .md-ink-ripple, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-warn .md-checked .md-ink-ripple, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-ink-ripple, md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-warn .md-checked .md-ink-ripple, md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-warn.md-checked .md-ink-ripple, md-radio-button.md-THEME_NAME-theme:not([disabled]).md-warn .md-checked .md-ink-ripple, md-radio-button.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-ink-ripple {  color: '{{warn-color-0.87}}'; }md-radio-group.md-THEME_NAME-theme:not([disabled]) .md-warn .md-container .md-ripple, md-radio-group.md-THEME_NAME-theme:not([disabled]).md-warn .md-container .md-ripple, md-radio-button.md-THEME_NAME-theme:not([disabled]) .md-warn .md-container .md-ripple, md-radio-button.md-THEME_NAME-theme:not([disabled]).md-warn .md-container .md-ripple {  color: '{{warn-600}}'; }md-radio-group.md-THEME_NAME-theme[disabled], md-radio-button.md-THEME_NAME-theme[disabled] {  color: '{{foreground-3}}'; }  md-radio-group.md-THEME_NAME-theme[disabled] .md-container .md-off, md-radio-button.md-THEME_NAME-theme[disabled] .md-container .md-off {    border-color: '{{foreground-3}}'; }  md-radio-group.md-THEME_NAME-theme[disabled] .md-container .md-on, md-radio-button.md-THEME_NAME-theme[disabled] .md-container .md-on {    border-color: '{{foreground-3}}'; }md-radio-group.md-THEME_NAME-theme.md-focused:not(:empty) .md-checked .md-container:before {  background-color: '{{accent-color-0.26}}'; }md-radio-group.md-THEME_NAME-theme.md-focused:not(:empty) .md-checked:not([disabled]).md-primary .md-container:before {  background-color: '{{primary-color-0.26}}'; }md-radio-group.md-THEME_NAME-theme.md-focused:not(:empty) .md-checked.md-primary .md-container:before {  background-color: '{{warn-color-0.26}}'; }md-select.md-THEME_NAME-theme.ng-invalid.ng-dirty .md-select-label {  color: '{{warn-500}}' !important;  border-bottom-color: '{{warn-500}}' !important; }md-select.md-THEME_NAME-theme:not([disabled]):focus .md-select-label {  border-bottom-color: '{{primary-color}}';  color: '{{ foreground-1 }}'; }  md-select.md-THEME_NAME-theme:not([disabled]):focus .md-select-label.md-placeholder {    color: '{{ foreground-1 }}'; }md-select.md-THEME_NAME-theme:not([disabled]):focus.md-accent .md-select-label {  border-bottom-color: '{{accent-color}}'; }md-select.md-THEME_NAME-theme:not([disabled]):focus.md-warn .md-select-label {  border-bottom-color: '{{warn-color}}'; }md-select.md-THEME_NAME-theme[disabled] .md-select-label {  color: '{{foreground-3}}'; }  md-select.md-THEME_NAME-theme[disabled] .md-select-label.md-placeholder {    color: '{{foreground-3}}'; }md-select.md-THEME_NAME-theme .md-select-label {  border-bottom-color: '{{foreground-4}}'; }  md-select.md-THEME_NAME-theme .md-select-label.md-placeholder {    color: '{{foreground-2}}'; }md-select-menu.md-THEME_NAME-theme md-optgroup {  color: '{{foreground-2}}'; }  md-select-menu.md-THEME_NAME-theme md-optgroup md-option {    color: '{{foreground-1}}'; }md-select-menu.md-THEME_NAME-theme md-option[selected] {  color: '{{primary-500}}'; }  md-select-menu.md-THEME_NAME-theme md-option[selected]:focus {    color: '{{primary-600}}'; }  md-select-menu.md-THEME_NAME-theme md-option[selected].md-accent {    color: '{{accent-500}}'; }    md-select-menu.md-THEME_NAME-theme md-option[selected].md-accent:focus {      color: '{{accent-600}}'; }md-select-menu.md-THEME_NAME-theme md-option:focus:not([selected]) {  background: '{{background-200}}'; }md-sidenav.md-THEME_NAME-theme {  background-color: '{{background-color}}'; }md-slider.md-THEME_NAME-theme .md-track {  background-color: '{{foreground-3}}'; }md-slider.md-THEME_NAME-theme .md-track-ticks {  background-color: '{{foreground-4}}'; }md-slider.md-THEME_NAME-theme .md-focus-thumb {  background-color: '{{foreground-2}}'; }md-slider.md-THEME_NAME-theme .md-focus-ring {  border-color: '{{foreground-4}}'; }md-slider.md-THEME_NAME-theme .md-disabled-thumb {  border-color: '{{background-color}}'; }md-slider.md-THEME_NAME-theme.md-min .md-thumb:after {  background-color: '{{background-color}}'; }md-slider.md-THEME_NAME-theme .md-track.md-track-fill {  background-color: '{{accent-color}}'; }md-slider.md-THEME_NAME-theme .md-thumb:after {  border-color: '{{accent-color}}';  background-color: '{{accent-color}}'; }md-slider.md-THEME_NAME-theme .md-sign {  background-color: '{{accent-color}}'; }  md-slider.md-THEME_NAME-theme .md-sign:after {    border-top-color: '{{accent-color}}'; }md-slider.md-THEME_NAME-theme .md-thumb-text {  color: '{{accent-contrast}}'; }md-slider.md-THEME_NAME-theme.md-warn .md-track.md-track-fill {  background-color: '{{warn-color}}'; }md-slider.md-THEME_NAME-theme.md-warn .md-thumb:after {  border-color: '{{warn-color}}';  background-color: '{{warn-color}}'; }md-slider.md-THEME_NAME-theme.md-warn .md-sign {  background-color: '{{warn-color}}'; }  md-slider.md-THEME_NAME-theme.md-warn .md-sign:after {    border-top-color: '{{warn-color}}'; }md-slider.md-THEME_NAME-theme.md-warn .md-thumb-text {  color: '{{warn-contrast}}'; }md-slider.md-THEME_NAME-theme.md-primary .md-track.md-track-fill {  background-color: '{{primary-color}}'; }md-slider.md-THEME_NAME-theme.md-primary .md-thumb:after {  border-color: '{{primary-color}}';  background-color: '{{primary-color}}'; }md-slider.md-THEME_NAME-theme.md-primary .md-sign {  background-color: '{{primary-color}}'; }  md-slider.md-THEME_NAME-theme.md-primary .md-sign:after {    border-top-color: '{{primary-color}}'; }md-slider.md-THEME_NAME-theme.md-primary .md-thumb-text {  color: '{{primary-contrast}}'; }md-slider.md-THEME_NAME-theme[disabled] .md-thumb:after {  border-color: '{{foreground-3}}'; }md-slider.md-THEME_NAME-theme[disabled]:not(.md-min) .md-thumb:after {  background-color: '{{foreground-3}}'; }.md-subheader.md-THEME_NAME-theme {  color: '{{ foreground-2-0.23 }}';  background-color: '{{background-color}}'; }  .md-subheader.md-THEME_NAME-theme.md-primary {    color: '{{primary-color}}'; }  .md-subheader.md-THEME_NAME-theme.md-accent {    color: '{{accent-color}}'; }  .md-subheader.md-THEME_NAME-theme.md-warn {    color: '{{warn-color}}'; }md-switch.md-THEME_NAME-theme .md-thumb {  background-color: '{{background-50}}'; }md-switch.md-THEME_NAME-theme .md-bar {  background-color: '{{background-500}}'; }md-switch.md-THEME_NAME-theme.md-checked .md-thumb {  background-color: '{{accent-color}}'; }md-switch.md-THEME_NAME-theme.md-checked .md-bar {  background-color: '{{accent-color-0.5}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-focused .md-thumb:before {  background-color: '{{accent-color-0.26}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-primary .md-thumb {  background-color: '{{primary-color}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-primary .md-bar {  background-color: '{{primary-color-0.5}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-primary.md-focused .md-thumb:before {  background-color: '{{primary-color-0.26}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-warn .md-thumb {  background-color: '{{warn-color}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-warn .md-bar {  background-color: '{{warn-color-0.5}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-warn.md-focused .md-thumb:before {  background-color: '{{warn-color-0.26}}'; }md-switch.md-THEME_NAME-theme[disabled] .md-thumb {  background-color: '{{background-400}}'; }md-switch.md-THEME_NAME-theme[disabled] .md-bar {  background-color: '{{foreground-4}}'; }md-tabs.md-THEME_NAME-theme md-tabs-wrapper {  background-color: transparent;  border-color: '{{foreground-4}}'; }md-tabs.md-THEME_NAME-theme .md-paginator md-icon {  color: '{{primary-color}}'; }md-tabs.md-THEME_NAME-theme md-ink-bar {  color: '{{accent-color}}';  background: '{{accent-color}}'; }md-tabs.md-THEME_NAME-theme .md-tab {  color: '{{foreground-2}}'; }  md-tabs.md-THEME_NAME-theme .md-tab[disabled] {    color: '{{foreground-3}}'; }  md-tabs.md-THEME_NAME-theme .md-tab.md-active, md-tabs.md-THEME_NAME-theme .md-tab.md-focused {    color: '{{primary-color}}'; }  md-tabs.md-THEME_NAME-theme .md-tab.md-focused {    background: '{{primary-color-0.1}}'; }  md-tabs.md-THEME_NAME-theme .md-tab .md-ripple-container {    color: '{{accent-100}}'; }md-tabs.md-THEME_NAME-theme.md-accent md-tabs-wrapper {  background-color: '{{accent-color}}'; }md-tabs.md-THEME_NAME-theme.md-accent md-tab-item:not([disabled]) {  color: '{{accent-100}}'; }  md-tabs.md-THEME_NAME-theme.md-accent md-tab-item:not([disabled]).md-active, md-tabs.md-THEME_NAME-theme.md-accent md-tab-item:not([disabled]).md-focused {    color: '{{accent-contrast}}'; }  md-tabs.md-THEME_NAME-theme.md-accent md-tab-item:not([disabled]).md-focused {    background: '{{accent-contrast-0.1}}'; }md-tabs.md-THEME_NAME-theme.md-accent md-ink-bar {  color: '{{primary-600-1}}';  background: '{{primary-600-1}}'; }md-tabs.md-THEME_NAME-theme.md-primary md-tabs-wrapper {  background-color: '{{primary-color}}'; }md-tabs.md-THEME_NAME-theme.md-primary md-tab-item:not([disabled]) {  color: '{{primary-100}}'; }  md-tabs.md-THEME_NAME-theme.md-primary md-tab-item:not([disabled]).md-active, md-tabs.md-THEME_NAME-theme.md-primary md-tab-item:not([disabled]).md-focused {    color: '{{primary-contrast}}'; }  md-tabs.md-THEME_NAME-theme.md-primary md-tab-item:not([disabled]).md-focused {    background: '{{primary-contrast-0.1}}'; }md-tabs.md-THEME_NAME-theme.md-warn md-tabs-wrapper {  background-color: '{{warn-color}}'; }md-tabs.md-THEME_NAME-theme.md-warn md-tab-item:not([disabled]) {  color: '{{warn-100}}'; }  md-tabs.md-THEME_NAME-theme.md-warn md-tab-item:not([disabled]).md-active, md-tabs.md-THEME_NAME-theme.md-warn md-tab-item:not([disabled]).md-focused {    color: '{{warn-contrast}}'; }  md-tabs.md-THEME_NAME-theme.md-warn md-tab-item:not([disabled]).md-focused {    background: '{{warn-contrast-0.1}}'; }md-toolbar > md-tabs.md-THEME_NAME-theme md-tabs-wrapper {  background-color: '{{primary-color}}'; }md-toolbar > md-tabs.md-THEME_NAME-theme md-tab-item:not([disabled]) {  color: '{{primary-100}}'; }  md-toolbar > md-tabs.md-THEME_NAME-theme md-tab-item:not([disabled]).md-active, md-toolbar > md-tabs.md-THEME_NAME-theme md-tab-item:not([disabled]).md-focused {    color: '{{primary-contrast}}'; }  md-toolbar > md-tabs.md-THEME_NAME-theme md-tab-item:not([disabled]).md-focused {    background: '{{primary-contrast-0.1}}'; }md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme md-tabs-wrapper {  background-color: '{{accent-color}}'; }md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme md-tab-item:not([disabled]) {  color: '{{accent-100}}'; }  md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme md-tab-item:not([disabled]).md-active, md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme md-tab-item:not([disabled]).md-focused {    color: '{{accent-contrast}}'; }  md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme md-tab-item:not([disabled]).md-focused {    background: '{{accent-contrast-0.1}}'; }md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme md-ink-bar {  color: '{{primary-600-1}}';  background: '{{primary-600-1}}'; }md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme md-tabs-wrapper {  background-color: '{{warn-color}}'; }md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme md-tab-item:not([disabled]) {  color: '{{warn-100}}'; }  md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme md-tab-item:not([disabled]).md-active, md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme md-tab-item:not([disabled]).md-focused {    color: '{{warn-contrast}}'; }  md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme md-tab-item:not([disabled]).md-focused {    background: '{{warn-contrast-0.1}}'; }md-toast.md-THEME_NAME-theme {  background-color: #323232;  color: '{{background-50}}'; }  md-toast.md-THEME_NAME-theme .md-button {    color: '{{background-50}}'; }    md-toast.md-THEME_NAME-theme .md-button.md-highlight {      color: '{{primary-A200}}'; }      md-toast.md-THEME_NAME-theme .md-button.md-highlight.md-accent {        color: '{{accent-A200}}'; }      md-toast.md-THEME_NAME-theme .md-button.md-highlight.md-warn {        color: '{{warn-A200}}'; }md-toolbar.md-THEME_NAME-theme {  background-color: '{{primary-color}}';  color: '{{primary-contrast}}'; }  md-toolbar.md-THEME_NAME-theme .md-button {    color: '{{primary-contrast}}'; }  md-toolbar.md-THEME_NAME-theme.md-accent {    background-color: '{{accent-color}}';    color: '{{accent-contrast}}'; }  md-toolbar.md-THEME_NAME-theme.md-warn {    background-color: '{{warn-color}}';    color: '{{warn-contrast}}'; }md-tooltip.md-THEME_NAME-theme {  color: '{{background-A100}}'; }  md-tooltip.md-THEME_NAME-theme .md-background {    background-color: '{{foreground-2}}'; }");

    }();
var DocsApp = angular.module("docsApp", ["ngMaterial", "ngRoute", "angularytics", "ngMessages"]).config(["SERVICES", "COMPONENTS", "DEMOS", "PAGES", "$routeProvider", "$mdThemingProvider", function(e, t, n, o, a, i) {
    a.when("/", {
        templateUrl: "partials/home.tmpl.html"
    }).when("/layout/:tmpl", {
        templateUrl: function(e) {
            return "partials/layout-" + e.tmpl + ".tmpl.html"
        }
    }).when("/layout/", {
        redirectTo: function() {
            return "/layout/container"
        }
    }).when("/demo/", {
        redirectTo: function() {
            return n[0].url
        }
    }).when("/api/", {
        redirectTo: function() {
            return t[0].docs[0].url
        }
    }).when("/getting-started", {
        templateUrl: "partials/getting-started.tmpl.html"
    }), i.theme("docs-dark", "default").primaryPalette("yellow").dark(), angular.forEach(o, function(e, t) {
        angular.forEach(e, function(e) {
            a.when(e.url, {
                templateUrl: e.outputPath,
                controller: "GuideCtrl"
            })
        })
    }), angular.forEach(t, function(e) {
        angular.forEach(e.docs, function(t) {
            t.url = "/" + t.url, a.when(t.url, {
                templateUrl: t.outputPath,
                resolve: {
                    component: function() {
                        return e
                    },
                    doc: function() {
                        return t
                    }
                },
                controller: "ComponentDocCtrl"
            })
        })
    }), angular.forEach(e, function(e) {
        e.url = "/" + e.url, a.when(e.url, {
            templateUrl: e.outputPath,
            resolve: {
                component: function() {
                    return void 0
                },
                doc: function() {
                    return e
                }
            },
            controller: "ComponentDocCtrl"
        })
    }), angular.forEach(n, function(e) {
        var n;
        angular.forEach(t, function(t) {
            e.name === t.name && (n = t)
        }), n = n || angular.extend({}, e), a.when(e.url, {
            templateUrl: "partials/demo.tmpl.html",
            controller: "DemoCtrl",
            resolve: {
                component: function() {
                    return n
                },
                demos: function() {
                    return e.demos
                }
            }
        })
    }), a.otherwise("/")
}]).config(["AngularyticsProvider", function(e) {
    e.setEventHandlers(["Console", "GoogleUniversal"])
}]).run(["Angularytics", "$rootScope", "$timeout", function(e, t, n) {
    e.init()
}]).factory("menu", ["SERVICES", "COMPONENTS", "DEMOS", "PAGES", "$location", "$rootScope", function(e, t, n, o, a, i) {
    function r(e, t) {
        return e.name < t.name ? -1 : 1
    }

    function l() {
        var e = a.path();
        if ("/" == e) return u.selectSection(null), void u.selectPage(null, null);
        var t = function(t, n) {
            e === n.url && (u.selectSection(t), u.selectPage(t, n))
        };
        d.forEach(function(e) {
            e.children ? e.children.forEach(function(e) {
                e.pages && e.pages.forEach(function(n) {
                    t(e, n)
                })
            }) : e.pages ? e.pages.forEach(function(n) {
                t(e, n)
            }) : "link" === e.type && t(e, e)
        })
    }
    var d = [{
            name: "Getting Started",
            url: "/getting-started",
            type: "link"
        }],
        s = [];
    angular.forEach(n, function(e) {
        s.push({
            name: e.label,
            url: e.url
        })
    }), d.push({
        name: "Demos",
        pages: s.sort(r),
        type: "toggle"
    }), d.push(), d.push({
        name: "Customization",
        type: "heading",
        children: [{
            name: "CSS",
            type: "toggle",
            pages: [{
                name: "Typography",
                url: "/CSS/typography",
                type: "link"
            }]
        }, {
            name: "Theming",
            type: "toggle",
            pages: [{
                name: "Introduction and Terms",
                url: "/Theming/01_introduction",
                type: "link"
            }, {
                name: "Declarative Syntax",
                url: "/Theming/02_declarative_syntax",
                type: "link"
            }, {
                name: "Configuring a Theme",
                url: "/Theming/03_configuring_a_theme",
                type: "link"
            }, {
                name: "Multiple Themes",
                url: "/Theming/04_multiple_themes",
                type: "link"
            }]
        }]
    });
    var c = {},
        m = {};
    t.forEach(function(e) {
        e.docs.forEach(function(e) {
            angular.isDefined(e["private"]) || (m[e.type] = m[e.type] || [], m[e.type].push(e), c[e.module] = c[e.module] || [], c[e.module].push(e))
        })
    }), e.forEach(function(e) {
        angular.isDefined(e["private"]) || (m[e.type] = m[e.type] || [], m[e.type].push(e), c[e.module] = c[e.module] || [], c[e.module].push(e))
    }), d.push({
        name: "API Reference",
        type: "heading",
        children: [{
            name: "Layout",
            type: "toggle",
            pages: [{
                name: "Container Elements",
                id: "layoutContainers",
                url: "/layout/container"
            }, {
                name: "Grid System",
                id: "layoutGrid",
                url: "/layout/grid"
            }, {
                name: "Child Alignment",
                id: "layoutAlign",
                url: "/layout/alignment"
            }, {
                name: "Options",
                id: "layoutOptions",
                url: "/layout/options"
            }]
        }, {
            name: "Services",
            pages: m.service.sort(r),
            type: "toggle"
        }, {
            name: "Directives",
            pages: m.directive.sort(r),
            type: "toggle"
        }]
    });
    var u;
    return i.$on("$locationChangeSuccess", l), u = {
        sections: d,
        selectSection: function(e) {
            u.openedSection = e
        },
        toggleSelectSection: function(e) {
            u.openedSection = u.openedSection === e ? null : e
        },
        isSectionSelected: function(e) {
            return u.openedSection === e
        },
        selectPage: function(e, t) {
            u.currentSection = e, u.currentPage = t
        },
        isPageSelected: function(e) {
            return u.currentPage === e
        }
    }
}]).directive("menuLink", function() {
    return {
        scope: {
            section: "="
        },
        templateUrl: "partials/menu-link.tmpl.html",
        link: function(e, t) {
            var n = t.parent().controller();
            e.isSelected = function() {
                return n.isSelected(e.section)
            }, e.focusSection = function() {
                n.autoFocusContent = !0
            }
        }
    }
}).directive("menuToggle", function() {
    return {
        scope: {
            section: "="
        },
        templateUrl: "partials/menu-toggle.tmpl.html",
        link: function(e, t) {
            var n = t.parent().controller();
            e.isOpen = function() {
                return n.isOpen(e.section)
            }, e.toggle = function() {
                n.toggleOpen(e.section)
            };
            var o = t[0].parentNode.parentNode.parentNode;
            if (o.classList.contains("parent-list-item")) {
                var a = o.querySelector("h2");
                t[0].firstChild.setAttribute("aria-describedby", a.id)
            }
        }
    }
}).controller("DocsCtrl", ["$scope", "COMPONENTS", "BUILDCONFIG", "$mdSidenav", "$timeout", "$mdDialog", "menu", "$location", "$rootScope", "$log", function(e, t, n, o, a, i, r, l, d, s) {
    function c() {
        a(function() {
            o("left").close()
        })
    }

    function m() {
        a(function() {
            o("left").open()
        })
    }

    function u() {
        return l.path()
    }

    function p(e) {
        r.selectPage(null, null), l.path("/")
    }

    function h() {
        e.closeMenu(), M.autoFocusContent && (f(), M.autoFocusContent = !1)
    }

    function f(e) {
        e && e.preventDefault(), a(function() {
            y.focus()
        }, 90)
    }

    function g(e) {
        return r.isPageSelected(e)
    }

    function b(e) {
        var t = !1,
            n = r.openedSection;
        return n === e ? t = !0 : e.children && e.children.forEach(function(e) {
            e === n && (t = !0)
        }), t
    }

    function v(e) {
        return r.isSectionSelected(e)
    }

    function E(e) {
        r.toggleSelectSection(e)
    }
    var M = this;
    e.COMPONENTS = t, e.BUILDCONFIG = n, e.menu = r, e.path = u, e.goHome = p, e.openMenu = m, e.closeMenu = c, e.isSectionSelected = b, d.$on("$locationChangeSuccess", h), e.focusMainContent = f, this.isOpen = v, this.isSelected = g, this.toggleOpen = E, this.autoFocusContent = !1;
    var y = document.querySelector("[role='main']")
}]).controller("HomeCtrl", ["$scope", "$rootScope", "$http", function(e, t, n) {
    t.currentComponent = t.currentDoc = null, e.version = "", e.versionURL = "";
    Math.round((new Date).getTime() / 1e3);
    n.get("version.json").then(function(t) {
        var n = t.data.sha || "",
            o = t.data.url;
        n && (e.versionURL = o + n, e.version = n.substr(0, 6))
    })
}]).controller("GuideCtrl", ["$rootScope", function(e) {
    e.currentComponent = e.currentDoc = null
}]).controller("LayoutCtrl", ["$scope", "$attrs", "$location", "$rootScope", function(e, t, n, o) {
    o.currentComponent = o.currentDoc = null, e.layoutDemo = {
        mainAxis: "center",
        crossAxis: "center",
        direction: "row"
    }, e.layoutAlign = function() {
        return e.layoutDemo.mainAxis + " " + e.layoutDemo.crossAxis
    }
}]).controller("ComponentDocCtrl", ["$scope", "doc", "component", "$rootScope", "$templateCache", "$http", "$q", function(e, t, n, o, a, i, r) {
    o.currentComponent = n, o.currentDoc = t
}]).controller("DemoCtrl", ["$rootScope", "$scope", "component", "demos", "$http", "$templateCache", "$q", function(e, t, n, o, a, i, r) {
    e.currentComponent = n, e.currentDoc = null, t.demos = [], angular.forEach(o, function(e) {
        var n = [e.index].concat(e.js || []).concat(e.css || []).concat(e.html || []);
        n.forEach(function(e) {
            e.httpPromise = a.get(e.outputPath, {
                cache: i
            }).then(function(t) {
                return e.contents = t.data.replace("<head/>", ""), e.contents
            })
        }), e.$files = n, t.demos.push(e)
    }), t.demos = t.demos.sort(function(e, t) {
        return e.name > t.name ? 1 : -1
    })
}]).filter("nospace", function() {
    return function(e) {
        return e ? e.replace(/ /g, "") : ""
    }
}).filter("humanizeDoc", function() {
    return function(e) {
        return e ? "directive" === e.type ? e.name.replace(/([A-Z])/g, function(e) {
            return "-" + e.toLowerCase()
        }) : e.label || e.name : void 0
    }
}).filter("directiveBrackets", function() {
    return function(e) {
        return e.indexOf("-") > -1 ? "<" + e + ">" : e
    }
});
DocsApp.constant("BUILDCONFIG", {
    ngVersion: "1.3.15",
    version: "0.9.0-rc2",
    repository: "https://github.com/angular/material",
    commit: "99b4f2f82aa2923df87131d9d7d527c143d45857",
    date: "2015-04-22 16:28:41 -0400"
}), DocsApp.constant("COMPONENTS", [{
    name: "material.components.bottomSheet",
    type: "module",
    outputPath: "partials/api/material.components.bottomSheet/index.html",
    url: "api/material.components.bottomSheet",
    label: "material.components.bottomSheet",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "$mdBottomSheet",
        type: "service",
        outputPath: "partials/api/material.components.bottomSheet/service/$mdBottomSheet.html",
        url: "api/material.components.bottomSheet/service/$mdBottomSheet",
        label: "$mdBottomSheet",
        hasDemo: !1,
        module: "material.components.bottomSheet",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/bottomSheet/bottomSheet.js"
    }]
}, {
    name: "material.components.button",
    type: "module",
    outputPath: "partials/api/material.components.button/index.html",
    url: "api/material.components.button",
    label: "material.components.button",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdButton",
        type: "directive",
        outputPath: "partials/api/material.components.button/directive/mdButton.html",
        url: "api/material.components.button/directive/mdButton",
        label: "mdButton",
        hasDemo: !0,
        module: "material.components.button",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/button/button.js"
    }]
}, {
    name: "material.components.card",
    type: "module",
    outputPath: "partials/api/material.components.card/index.html",
    url: "api/material.components.card",
    label: "material.components.card",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdCard",
        type: "directive",
        outputPath: "partials/api/material.components.card/directive/mdCard.html",
        url: "api/material.components.card/directive/mdCard",
        label: "mdCard",
        hasDemo: !0,
        module: "material.components.card",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/card/card.js"
    }]
}, {
    name: "material.components.checkbox",
    type: "module",
    outputPath: "partials/api/material.components.checkbox/index.html",
    url: "api/material.components.checkbox",
    label: "material.components.checkbox",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdCheckbox",
        type: "directive",
        outputPath: "partials/api/material.components.checkbox/directive/mdCheckbox.html",
        url: "api/material.components.checkbox/directive/mdCheckbox",
        label: "mdCheckbox",
        hasDemo: !0,
        module: "material.components.checkbox",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/checkbox/checkbox.js"
    }]
}, {
    name: "material.components.content",
    type: "module",
    outputPath: "partials/api/material.components.content/index.html",
    url: "api/material.components.content",
    label: "material.components.content",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdContent",
        type: "directive",
        outputPath: "partials/api/material.components.content/directive/mdContent.html",
        url: "api/material.components.content/directive/mdContent",
        label: "mdContent",
        hasDemo: !0,
        module: "material.components.content",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/content/content.js"
    }]
}, {
    name: "material.components.dialog",
    type: "module",
    outputPath: "partials/api/material.components.dialog/index.html",
    url: "api/material.components.dialog",
    label: "material.components.dialog",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "$mdDialog",
        type: "service",
        outputPath: "partials/api/material.components.dialog/service/$mdDialog.html",
        url: "api/material.components.dialog/service/$mdDialog",
        label: "$mdDialog",
        hasDemo: !1,
        module: "material.components.dialog",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/dialog/dialog.js"
    }]
}, {
    name: "material.components.divider",
    type: "module",
    outputPath: "partials/api/material.components.divider/index.html",
    url: "api/material.components.divider",
    label: "material.components.divider",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdDivider",
        type: "directive",
        outputPath: "partials/api/material.components.divider/directive/mdDivider.html",
        url: "api/material.components.divider/directive/mdDivider",
        label: "mdDivider",
        hasDemo: !0,
        module: "material.components.divider",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/divider/divider.js"
    }]
}, {
    name: "material.components.gridList",
    type: "module",
    outputPath: "partials/api/material.components.gridList/index.html",
    url: "api/material.components.gridList",
    label: "material.components.gridList",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdGridList",
        type: "directive",
        outputPath: "partials/api/material.components.gridList/directive/mdGridList.html",
        url: "api/material.components.gridList/directive/mdGridList",
        label: "mdGridList",
        hasDemo: !0,
        module: "material.components.gridList",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/gridList/gridList.js"
    }, {
        name: "mdGridTile",
        type: "directive",
        outputPath: "partials/api/material.components.gridList/directive/mdGridTile.html",
        url: "api/material.components.gridList/directive/mdGridTile",
        label: "mdGridTile",
        hasDemo: !0,
        module: "material.components.gridList",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/gridList/gridList.js"
    }]
}, {
    name: "material.components.icon",
    type: "module",
    outputPath: "partials/api/material.components.icon/index.html",
    url: "api/material.components.icon",
    label: "material.components.icon",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdIcon",
        type: "directive",
        outputPath: "partials/api/material.components.icon/directive/mdIcon.html",
        url: "api/material.components.icon/directive/mdIcon",
        label: "mdIcon",
        hasDemo: !0,
        module: "material.components.icon",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/icon/icon.js"
    }, {
        name: "$mdIconProvider",
        type: "service",
        outputPath: "partials/api/material.components.icon/service/$mdIconProvider.html",
        url: "api/material.components.icon/service/$mdIconProvider",
        label: "$mdIconProvider",
        hasDemo: !1,
        module: "material.components.icon",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/icon/icon.js"
    }, {
        name: "$mdIcon",
        type: "service",
        outputPath: "partials/api/material.components.icon/service/$mdIcon.html",
        url: "api/material.components.icon/service/$mdIcon",
        label: "$mdIcon",
        hasDemo: !1,
        module: "material.components.icon",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/icon/icon.js"
    }]
}, {
    name: "material.components.input",
    type: "module",
    outputPath: "partials/api/material.components.input/index.html",
    url: "api/material.components.input",
    label: "material.components.input",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdInputContainer",
        type: "directive",
        outputPath: "partials/api/material.components.input/directive/mdInputContainer.html",
        url: "api/material.components.input/directive/mdInputContainer",
        label: "mdInputContainer",
        hasDemo: !0,
        module: "material.components.input",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/input/input.js"
    }, {
        name: "mdInput",
        type: "directive",
        outputPath: "partials/api/material.components.input/directive/mdInput.html",
        url: "api/material.components.input/directive/mdInput",
        label: "mdInput",
        hasDemo: !0,
        module: "material.components.input",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/input/input.js"
    }]
}, {
    name: "material.components.list",
    type: "module",
    outputPath: "partials/api/material.components.list/index.html",
    url: "api/material.components.list",
    label: "material.components.list",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdList",
        type: "directive",
        outputPath: "partials/api/material.components.list/directive/mdList.html",
        url: "api/material.components.list/directive/mdList",
        label: "mdList",
        hasDemo: !0,
        module: "material.components.list",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/list/list.js"
    }, {
        name: "mdListItem",
        type: "directive",
        outputPath: "partials/api/material.components.list/directive/mdListItem.html",
        url: "api/material.components.list/directive/mdListItem",
        label: "mdListItem",
        hasDemo: !0,
        module: "material.components.list",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/list/list.js"
    }]
}, {
    name: "material.components.progressCircular",
    type: "module",
    outputPath: "partials/api/material.components.progressCircular/index.html",
    url: "api/material.components.progressCircular",
    label: "material.components.progressCircular",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdProgressCircular",
        type: "directive",
        outputPath: "partials/api/material.components.progressCircular/directive/mdProgressCircular.html",
        url: "api/material.components.progressCircular/directive/mdProgressCircular",
        label: "mdProgressCircular",
        hasDemo: !0,
        module: "material.components.progressCircular",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/progressCircular/progressCircular.js"
    }]
}, {
    name: "material.components.progressLinear",
    type: "module",
    outputPath: "partials/api/material.components.progressLinear/index.html",
    url: "api/material.components.progressLinear",
    label: "material.components.progressLinear",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdProgressLinear",
        type: "directive",
        outputPath: "partials/api/material.components.progressLinear/directive/mdProgressLinear.html",
        url: "api/material.components.progressLinear/directive/mdProgressLinear",
        label: "mdProgressLinear",
        hasDemo: !0,
        module: "material.components.progressLinear",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/progressLinear/progressLinear.js"
    }]
}, {
    name: "material.components.radioButton",
    type: "module",
    outputPath: "partials/api/material.components.radioButton/index.html",
    url: "api/material.components.radioButton",
    label: "material.components.radioButton",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdRadioGroup",
        type: "directive",
        outputPath: "partials/api/material.components.radioButton/directive/mdRadioGroup.html",
        url: "api/material.components.radioButton/directive/mdRadioGroup",
        label: "mdRadioGroup",
        hasDemo: !0,
        module: "material.components.radioButton",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/radioButton/radioButton.js"
    }, {
        name: "mdRadioButton",
        type: "directive",
        outputPath: "partials/api/material.components.radioButton/directive/mdRadioButton.html",
        url: "api/material.components.radioButton/directive/mdRadioButton",
        label: "mdRadioButton",
        hasDemo: !0,
        module: "material.components.radioButton",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/radioButton/radioButton.js"
    }]
}, {
    name: "material.components.select",
    type: "module",
    outputPath: "partials/api/material.components.select/index.html",
    url: "api/material.components.select",
    label: "material.components.select",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdSelect",
        type: "directive",
        outputPath: "partials/api/material.components.select/directive/mdSelect.html",
        url: "api/material.components.select/directive/mdSelect",
        label: "mdSelect",
        hasDemo: !0,
        module: "material.components.select",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/select/select.js"
    }]
}, {
    name: "material.components.sidenav",
    type: "module",
    outputPath: "partials/api/material.components.sidenav/index.html",
    url: "api/material.components.sidenav",
    label: "material.components.sidenav",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "$mdSidenav",
        type: "service",
        outputPath: "partials/api/material.components.sidenav/service/$mdSidenav.html",
        url: "api/material.components.sidenav/service/$mdSidenav",
        label: "$mdSidenav",
        hasDemo: !1,
        module: "material.components.sidenav",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/sidenav/sidenav.js"
    }, {
        name: "mdSidenavFocus",
        type: "directive",
        outputPath: "partials/api/material.components.sidenav/directive/mdSidenavFocus.html",
        url: "api/material.components.sidenav/directive/mdSidenavFocus",
        label: "mdSidenavFocus",
        hasDemo: !0,
        module: "material.components.sidenav",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/sidenav/sidenav.js"
    }, {
        name: "mdSidenav",
        type: "directive",
        outputPath: "partials/api/material.components.sidenav/directive/mdSidenav.html",
        url: "api/material.components.sidenav/directive/mdSidenav",
        label: "mdSidenav",
        hasDemo: !0,
        module: "material.components.sidenav",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/sidenav/sidenav.js"
    }]
}, {
    name: "material.components.slider",
    type: "module",
    outputPath: "partials/api/material.components.slider/index.html",
    url: "api/material.components.slider",
    label: "material.components.slider",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdSlider",
        type: "directive",
        outputPath: "partials/api/material.components.slider/directive/mdSlider.html",
        url: "api/material.components.slider/directive/mdSlider",
        label: "mdSlider",
        hasDemo: !0,
        module: "material.components.slider",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/slider/slider.js"
    }]
}, {
    name: "material.components.subheader",
    type: "module",
    outputPath: "partials/api/material.components.subheader/index.html",
    url: "api/material.components.subheader",
    label: "material.components.subheader",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdSubheader",
        type: "directive",
        outputPath: "partials/api/material.components.subheader/directive/mdSubheader.html",
        url: "api/material.components.subheader/directive/mdSubheader",
        label: "mdSubheader",
        hasDemo: !0,
        module: "material.components.subheader",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/subheader/subheader.js"
    }]
}, {
    name: "material.components.swipe",
    type: "module",
    outputPath: "partials/api/material.components.swipe/index.html",
    url: "api/material.components.swipe",
    label: "material.components.swipe",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdSwipeLeft",
        type: "directive",
        outputPath: "partials/api/material.components.swipe/directive/mdSwipeLeft.html",
        url: "api/material.components.swipe/directive/mdSwipeLeft",
        label: "mdSwipeLeft",
        hasDemo: !0,
        module: "material.components.swipe",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/swipe/swipe.js"
    }, {
        name: "mdSwipeRight",
        type: "directive",
        outputPath: "partials/api/material.components.swipe/directive/mdSwipeRight.html",
        url: "api/material.components.swipe/directive/mdSwipeRight",
        label: "mdSwipeRight",
        hasDemo: !0,
        module: "material.components.swipe",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/swipe/swipe.js"
    }]
}, {
    name: "material.components.switch",
    type: "module",
    outputPath: "partials/api/material.components.switch/index.html",
    url: "api/material.components.switch",
    label: "material.components.switch",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdSwitch",
        type: "directive",
        outputPath: "partials/api/material.components.switch/directive/mdSwitch.html",
        url: "api/material.components.switch/directive/mdSwitch",
        label: "mdSwitch",
        hasDemo: !0,
        module: "material.components.switch",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/switch/switch.js"
    }]
}, {
    name: "material.components.toast",
    type: "module",
    outputPath: "partials/api/material.components.toast/index.html",
    url: "api/material.components.toast",
    label: "material.components.toast",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "$mdToast",
        type: "service",
        outputPath: "partials/api/material.components.toast/service/$mdToast.html",
        url: "api/material.components.toast/service/$mdToast",
        label: "$mdToast",
        hasDemo: !1,
        module: "material.components.toast",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/toast/toast.js"
    }]
}, {
    name: "material.components.toolbar",
    type: "module",
    outputPath: "partials/api/material.components.toolbar/index.html",
    url: "api/material.components.toolbar",
    label: "material.components.toolbar",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdToolbar",
        type: "directive",
        outputPath: "partials/api/material.components.toolbar/directive/mdToolbar.html",
        url: "api/material.components.toolbar/directive/mdToolbar",
        label: "mdToolbar",
        hasDemo: !0,
        module: "material.components.toolbar",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/toolbar/toolbar.js"
    }]
}, {
    name: "material.components.tooltip",
    type: "module",
    outputPath: "partials/api/material.components.tooltip/index.html",
    url: "api/material.components.tooltip",
    label: "material.components.tooltip",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdTooltip",
        type: "directive",
        outputPath: "partials/api/material.components.tooltip/directive/mdTooltip.html",
        url: "api/material.components.tooltip/directive/mdTooltip",
        label: "mdTooltip",
        hasDemo: !0,
        module: "material.components.tooltip",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/tooltip/tooltip.js"
    }]
}, {
    name: "material.components.autocomplete",
    type: "module",
    outputPath: "partials/api/material.components.autocomplete/index.html",
    url: "api/material.components.autocomplete",
    label: "material.components.autocomplete",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdAutocomplete",
        type: "directive",
        outputPath: "partials/api/material.components.autocomplete/directive/mdAutocomplete.html",
        url: "api/material.components.autocomplete/directive/mdAutocomplete",
        label: "mdAutocomplete",
        hasDemo: !0,
        module: "material.components.autocomplete",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/autocomplete/autocomplete.js"
    }, {
        name: "mdHighlightText",
        type: "directive",
        outputPath: "partials/api/material.components.autocomplete/directive/mdHighlightText.html",
        url: "api/material.components.autocomplete/directive/mdHighlightText",
        label: "mdHighlightText",
        hasDemo: !0,
        module: "material.components.autocomplete",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/autocomplete/autocomplete.js"
    }]
}, {
    name: "material.components.chips",
    type: "module",
    outputPath: "partials/api/material.components.chips/index.html",
    url: "api/material.components.chips",
    label: "material.components.chips",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdChip",
        type: "directive",
        outputPath: "partials/api/material.components.chips/directive/mdChip.html",
        url: "api/material.components.chips/directive/mdChip",
        label: "mdChip",
        hasDemo: !0,
        module: "material.components.chips",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/chips/chips.js"
    }, {
        name: "mdChipRemove",
        type: "directive",
        outputPath: "partials/api/material.components.chips/directive/mdChipRemove.html",
        url: "api/material.components.chips/directive/mdChipRemove",
        label: "mdChipRemove",
        hasDemo: !0,
        module: "material.components.chips",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/chips/chips.js"
    }, {
        name: "mdChips",
        type: "directive",
        outputPath: "partials/api/material.components.chips/directive/mdChips.html",
        url: "api/material.components.chips/directive/mdChips",
        label: "mdChips",
        hasDemo: !0,
        module: "material.components.chips",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/chips/chips.js"
    }, {
        name: "mdContactChips",
        type: "directive",
        outputPath: "partials/api/material.components.chips/directive/mdContactChips.html",
        url: "api/material.components.chips/directive/mdContactChips",
        label: "mdContactChips",
        hasDemo: !0,
        module: "material.components.chips",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/chips/chips.js"
    }]
}, {
    name: "material.components.tabs",
    type: "module",
    outputPath: "partials/api/material.components.tabs/index.html",
    url: "api/material.components.tabs",
    label: "material.components.tabs",
    hasDemo: !1,
    module: ".",
    githubUrl: "https://github.com/angular/material/blob/master/src/components/./..js",
    docs: [{
        name: "mdTab",
        type: "directive",
        outputPath: "partials/api/material.components.tabs/directive/mdTab.html",
        url: "api/material.components.tabs/directive/mdTab",
        label: "mdTab",
        hasDemo: !0,
        module: "material.components.tabs",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/tabs/tabs.js"
    }, {
        name: "mdTabs",
        type: "directive",
        outputPath: "partials/api/material.components.tabs/directive/mdTabs.html",
        url: "api/material.components.tabs/directive/mdTabs",
        label: "mdTabs",
        hasDemo: !0,
        module: "material.components.tabs",
        githubUrl: "https://github.com/angular/material/blob/master/src/components/tabs/tabs.js"
    }]
}]), DocsApp.constant("PAGES", {
    CSS: [{
        name: "Typography",
        outputPath: "partials/CSS/typography.html",
        url: "/CSS/typography",
        label: "Typography"
    }],
    Theming: [{
        name: "Introduction and Terms",
        outputPath: "partials/Theming/01_introduction.html",
        url: "/Theming/01_introduction",
        label: "Introduction and Terms"
    }, {
        name: "Declarative Syntax",
        outputPath: "partials/Theming/02_declarative_syntax.html",
        url: "/Theming/02_declarative_syntax",
        label: "Declarative Syntax"
    }, {
        name: "Configuring a Theme",
        outputPath: "partials/Theming/03_configuring_a_theme.html",
        url: "/Theming/03_configuring_a_theme",
        label: "Configuring a Theme"
    }, {
        name: "Multiple Themes",
        outputPath: "partials/Theming/04_multiple_themes.html",
        url: "/Theming/04_multiple_themes",
        label: "Multiple Themes"
    }]
}), angular.module("docsApp").constant("DEMOS", [{
    name: "material.components.autocomplete",
    label: "Autocomplete",
    demos: [{
        id: "autocompletedemoBasicUsage",
        css: [],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/autocomplete/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.autocomplete",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/autocomplete/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "autocompleteDemo",
            dependencies: ["ngMaterial"]
        }
    }, {
        id: "autocompletedemoFloatingLabel",
        css: [],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/autocomplete/demoFloatingLabel/script.js"
        }],
        moduleName: "material.components.autocomplete",
        name: "demoFloatingLabel",
        label: "Floating Label",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/autocomplete/demoFloatingLabel/index.html"
        },
        ngModule: {
            module: "autocompleteFloatingLabelDemo",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.autocomplete"
}, {
    name: "material.components.bottomSheet",
    label: "Bottom Sheet",
    demos: [{
        id: "bottomSheetdemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/bottomSheet/demoBasicUsage/style.css"
        }],
        html: [{
            name: "bottom-sheet-grid-template.html",
            label: "bottom-sheet-grid-template.html",
            fileType: "html",
            outputPath: "demo-partials/bottomSheet/demoBasicUsage/bottom-sheet-grid-template.html"
        }, {
            name: "bottom-sheet-list-template.html",
            label: "bottom-sheet-list-template.html",
            fileType: "html",
            outputPath: "demo-partials/bottomSheet/demoBasicUsage/bottom-sheet-list-template.html"
        }, {
            name: "readme.html",
            label: "readme.html",
            fileType: "html",
            outputPath: "demo-partials/bottomSheet/demoBasicUsage/readme.html"
        }],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/bottomSheet/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.bottomSheet",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/bottomSheet/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "bottomSheetDemo1",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.bottomSheet"
}, {
    name: "material.components.button",
    label: "Button",
    demos: [{
        id: "buttondemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/button/demoBasicUsage/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/button/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.button",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/button/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "buttonsDemo1",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.button"
}, {
    name: "material.components.card",
    label: "Card",
    demos: [{
        id: "carddemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/card/demoBasicUsage/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/card/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.card",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/card/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "cardDemo1",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.card"
}, {
    name: "material.components.checkbox",
    label: "Checkbox",
    demos: [{
        id: "checkboxdemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/checkbox/demoBasicUsage/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/checkbox/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.checkbox",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/checkbox/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "checkboxDemo1",
            dependencies: ["ngMaterial"]
        }
    }, {
        id: "checkboxdemoSyncing",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/checkbox/demoSyncing/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/checkbox/demoSyncing/script.js"
        }],
        moduleName: "material.components.checkbox",
        name: "demoSyncing",
        label: "Syncing",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/checkbox/demoSyncing/index.html"
        },
        ngModule: {
            module: "checkboxDemo1",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.checkbox"
}, {
    name: "material.components.chips",
    label: "Chips",
    demos: [{
        id: "chipsdemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/chips/demoBasicUsage/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/chips/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.chips",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/chips/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "chipsDemo",
            dependencies: ["ngMaterial"]
        }
    }, {
        id: "chipsdemoContactChips",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/chips/demoContactChips/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/chips/demoContactChips/script.js"
        }],
        moduleName: "material.components.chips",
        name: "demoContactChips",
        label: "Contact Chips",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/chips/demoContactChips/index.html"
        },
        ngModule: {
            module: "contactChipsDemo",
            dependencies: ["ngMaterial"]
        }
    }, {
        id: "chipsdemoCustomInputs",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/chips/demoCustomInputs/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/chips/demoCustomInputs/script.js"
        }],
        moduleName: "material.components.chips",
        name: "demoCustomInputs",
        label: "Custom Inputs",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/chips/demoCustomInputs/index.html"
        },
        ngModule: {
            module: "chipsCustomInputDemo",
            dependencies: ["ngMaterial"]
        }
    }, {
        id: "chipsdemoStaticChips",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/chips/demoStaticChips/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/chips/demoStaticChips/script.js"
        }],
        moduleName: "material.components.chips",
        name: "demoStaticChips",
        label: "Static Chips",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/chips/demoStaticChips/index.html"
        },
        ngModule: {
            module: "staticChipsDemo",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.chips"
}, {
    name: "material.components.content",
    label: "Content",
    demos: [{
        id: "contentdemoBasicUsage",
        css: [],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/content/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.content",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/content/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "contentDemo1",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.content"
}, {
    name: "material.components.dialog",
    label: "Dialog",
    demos: [{
        id: "dialogdemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/dialog/demoBasicUsage/style.css"
        }],
        html: [{
            name: "dialog1.tmpl.html",
            label: "dialog1.tmpl.html",
            fileType: "html",
            outputPath: "demo-partials/dialog/demoBasicUsage/dialog1.tmpl.html"
        }],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/dialog/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.dialog",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/dialog/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "dialogDemo1",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.dialog"
}, {
    name: "material.components.divider",
    label: "Divider",
    demos: [{
        id: "dividerdemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/divider/demoBasicUsage/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/divider/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.divider",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/divider/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "dividerDemo1",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.divider"
}, {
    name: "material.components.gridList",
    label: "Grid List",
    demos: [{
        id: "gridListdemoBasicUsage",
        css: [{
            name: "styles.css",
            label: "styles.css",
            fileType: "css",
            outputPath: "demo-partials/gridList/demoBasicUsage/styles.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/gridList/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.gridList",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/gridList/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "gridListDemo1",
            dependencies: ["ngMaterial"]
        }
    }, {
        id: "gridListdemoDynamicTiles",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/gridList/demoDynamicTiles/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/gridList/demoDynamicTiles/script.js"
        }],
        moduleName: "material.components.gridList",
        name: "demoDynamicTiles",
        label: "Dynamic Tiles",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/gridList/demoDynamicTiles/index.html"
        },
        ngModule: {
            module: "gridListDemoApp",
            dependencies: ["ngMaterial"]
        }
    }, {
        id: "gridListdemoResponsiveUsage",
        css: [],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/gridList/demoResponsiveUsage/script.js"
        }],
        moduleName: "material.components.gridList",
        name: "demoResponsiveUsage",
        label: "Responsive Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/gridList/demoResponsiveUsage/index.html"
        },
        ngModule: {
            module: "gridListDemo1",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.gridList"
}, {
    name: "material.components.icon",
    label: "Icon",
    demos: [{
        id: "icondemoFontIcons",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/icon/demoFontIcons/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/icon/demoFontIcons/script.js"
        }],
        moduleName: "material.components.icon",
        name: "demoFontIcons",
        label: "Font Icons",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/icon/demoFontIcons/index.html"
        },
        ngModule: {
            module: "appDemoFontIcons",
            dependencies: ["ngMaterial"]
        }
    }, {
        id: "icondemoLoadSvgIconsFromUrl",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/icon/demoLoadSvgIconsFromUrl/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/icon/demoLoadSvgIconsFromUrl/script.js"
        }],
        moduleName: "material.components.icon",
        name: "demoLoadSvgIconsFromUrl",
        label: "Load Svg Icons From Url",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/icon/demoLoadSvgIconsFromUrl/index.html"
        },
        ngModule: {
            module: "appDemoSvgIcons",
            dependencies: ["ngMaterial"]
        }
    }, {
        id: "icondemoSvgIconSets",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/icon/demoSvgIconSets/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/icon/demoSvgIconSets/script.js"
        }],
        moduleName: "material.components.icon",
        name: "demoSvgIconSets",
        label: "Svg Icon Sets",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/icon/demoSvgIconSets/index.html"
        },
        ngModule: {
            module: "appSvgIconSets",
            dependencies: ["ngMaterial"]
        }
    }, {
        id: "icondemoUsingTemplateCache",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/icon/demoUsingTemplateCache/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/icon/demoUsingTemplateCache/script.js"
        }],
        moduleName: "material.components.icon",
        name: "demoUsingTemplateCache",
        label: "Using Template Cache",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/icon/demoUsingTemplateCache/index.html"
        },
        ngModule: {
            module: "appUsingTemplateCache",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.icon"
}, {
    name: "material.components.input",
    label: "Input",
    demos: [{
        id: "inputdemoBasicUsage",
        css: [],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/input/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.input",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/input/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "inputBasicDemo",
            dependencies: ["ngMaterial", "ngMessages"]
        }
    }, {
        id: "inputdemoErrors",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/input/demoErrors/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/input/demoErrors/script.js"
        }],
        moduleName: "material.components.input",
        name: "demoErrors",
        label: "Errors",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/input/demoErrors/index.html"
        },
        ngModule: {
            module: "inputErrorsApp",
            dependencies: ["ngMaterial", "ngMessages"]
        }
    }, {
        id: "inputdemoIcons",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/input/demoIcons/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/input/demoIcons/script.js"
        }],
        moduleName: "material.components.input",
        name: "demoIcons",
        label: "Icons",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/input/demoIcons/index.html"
        },
        ngModule: {
            module: "inputIconDemo",
            dependencies: ["ngMaterial", "ngMessages"]
        }
    }],
    url: "/demo/material.components.input"
}, {
    name: "material.components.list",
    label: "List",
    demos: [{
        id: "listdemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/list/demoBasicUsage/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/list/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.list",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/list/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "listDemo1",
            dependencies: ["ngMaterial"]
        }
    }, {
        id: "listdemoListControls",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/list/demoListControls/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/list/demoListControls/script.js"
        }],
        moduleName: "material.components.list",
        name: "demoListControls",
        label: "List Controls",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/list/demoListControls/index.html"
        },
        ngModule: {
            module: "listDemo2",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.list"
}, {
    name: "material.components.progressCircular",
    label: "Progress Circular",
    demos: [{
        id: "progressCirculardemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/progressCircular/demoBasicUsage/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/progressCircular/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.progressCircular",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/progressCircular/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "progressCircularDemo1",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.progressCircular"
}, {
    name: "material.components.progressLinear",
    label: "Progress Linear",
    demos: [{
        id: "progressLineardemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/progressLinear/demoBasicUsage/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/progressLinear/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.progressLinear",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/progressLinear/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "progressLinearDemo1",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.progressLinear"
}, {
    name: "material.components.radioButton",
    label: "Radio Button",
    demos: [{
        id: "radioButtondemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/radioButton/demoBasicUsage/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/radioButton/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.radioButton",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/radioButton/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "radioDemo1",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.radioButton"
}, {
    name: "material.components.select",
    label: "Select",
    demos: [{
        id: "selectdemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/select/demoBasicUsage/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/select/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.select",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/select/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "selectDemoBasic",
            dependencies: ["ngMaterial"]
        }
    }, {
        id: "selectdemoOptionGroups",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/select/demoOptionGroups/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/select/demoOptionGroups/script.js"
        }],
        moduleName: "material.components.select",
        name: "demoOptionGroups",
        label: "Option Groups",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/select/demoOptionGroups/index.html"
        },
        ngModule: {
            module: "selectDemoOptGroups",
            dependencies: ["ngMaterial"]
        }
    }, {
        id: "selectdemoOptionsWithAsyncSearch",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/select/demoOptionsWithAsyncSearch/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/select/demoOptionsWithAsyncSearch/script.js"
        }],
        moduleName: "material.components.select",
        name: "demoOptionsWithAsyncSearch",
        label: "Options With Async Search",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/select/demoOptionsWithAsyncSearch/index.html"
        },
        ngModule: {
            module: "selectDemoOptionsAsync",
            dependencies: ["ngMaterial"]
        }
    }, {
        id: "selectdemoValidations",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/select/demoValidations/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/select/demoValidations/script.js"
        }],
        moduleName: "material.components.select",
        name: "demoValidations",
        label: "Validations",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/select/demoValidations/index.html"
        },
        ngModule: {
            module: "selectDemoBasic",
            dependencies: ["ngMaterial", "ngMessages"]
        }
    }],
    url: "/demo/material.components.select"
}, {
    name: "material.components.sidenav",
    label: "Sidenav",
    demos: [{
        id: "sidenavdemoBasicUsage",
        css: [],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/sidenav/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.sidenav",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/sidenav/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "sidenavDemo1",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.sidenav"
}, {
    name: "material.components.slider",
    label: "Slider",
    demos: [{
        id: "sliderdemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/slider/demoBasicUsage/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/slider/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.slider",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/slider/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "sliderDemo1",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.slider"
}, {
    name: "material.components.subheader",
    label: "Subheader",
    demos: [{
        id: "subheaderdemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/subheader/demoBasicUsage/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/subheader/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.subheader",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/subheader/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "subheaderBasicDemo",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.subheader"
}, {
    name: "material.components.switch",
    label: "Switch",
    demos: [{
        id: "switchdemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/switch/demoBasicUsage/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/switch/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.switch",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/switch/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "switchDemo1",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.switch"
}, {
    name: "material.components.tabs",
    label: "Tabs",
    demos: [{
        id: "tabsdemoDynamicHeight",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/tabs/demoDynamicHeight/style.css"
        }],
        html: [{
            name: "readme.html",
            label: "readme.html",
            fileType: "html",
            outputPath: "demo-partials/tabs/demoDynamicHeight/readme.html"
        }],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/tabs/demoDynamicHeight/script.js"
        }],
        moduleName: "material.components.tabs",
        name: "demoDynamicHeight",
        label: "Dynamic Height",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/tabs/demoDynamicHeight/index.html"
        },
        ngModule: {
            module: "tabsDemoDynamicHeight",
            dependencies: ["ngMaterial"]
        }
    }, {
        id: "tabsdemoDynamicTabs",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/tabs/demoDynamicTabs/style.css"
        }],
        html: [{
            name: "readme.html",
            label: "readme.html",
            fileType: "html",
            outputPath: "demo-partials/tabs/demoDynamicTabs/readme.html"
        }],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/tabs/demoDynamicTabs/script.js"
        }],
        moduleName: "material.components.tabs",
        name: "demoDynamicTabs",
        label: "Dynamic Tabs",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/tabs/demoDynamicTabs/index.html"
        },
        ngModule: {
            module: "tabsDemoDynamicTabs",
            dependencies: ["ngMaterial"]
        }
    }, {
        id: "tabsdemoStaticTabs",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/tabs/demoStaticTabs/style.css"
        }],
        html: [{
            name: "readme.html",
            label: "readme.html",
            fileType: "html",
            outputPath: "demo-partials/tabs/demoStaticTabs/readme.html"
        }],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/tabs/demoStaticTabs/script.js"
        }],
        moduleName: "material.components.tabs",
        name: "demoStaticTabs",
        label: "Static Tabs",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/tabs/demoStaticTabs/index.html"
        },
        ngModule: {
            module: "tabsDemo1",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.tabs"
}, {
    name: "material.components.toast",
    label: "Toast",
    demos: [{
        id: "toastdemoBasicUsage",
        css: [],
        html: [{
            name: "toast-template.html",
            label: "toast-template.html",
            fileType: "html",
            outputPath: "demo-partials/toast/demoBasicUsage/toast-template.html"
        }],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/toast/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.toast",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/toast/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "toastDemo1",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.toast"
}, {
    name: "material.components.toolbar",
    label: "Toolbar",
    demos: [{
        id: "toolbardemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/toolbar/demoBasicUsage/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/toolbar/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.toolbar",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/toolbar/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "toolbarDemo1",
            dependencies: ["ngMaterial"]
        }
    }, {
        id: "toolbardemoScrollShrink",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/toolbar/demoScrollShrink/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/toolbar/demoScrollShrink/script.js"
        }],
        moduleName: "material.components.toolbar",
        name: "demoScrollShrink",
        label: "Scroll Shrink",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/toolbar/demoScrollShrink/index.html"
        },
        ngModule: {
            module: "toolbarDemo2",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.toolbar"
}, {
    name: "material.components.tooltip",
    label: "Tooltip",
    demos: [{
        id: "tooltipdemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/tooltip/demoBasicUsage/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/tooltip/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.tooltip",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/tooltip/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "tooltipDemo1",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.tooltip"
}, {
    name: "material.components.whiteframe",
    label: "Whiteframe",
    demos: [{
        id: "whiteframedemoBasicUsage",
        css: [{
            name: "style.css",
            label: "style.css",
            fileType: "css",
            outputPath: "demo-partials/whiteframe/demoBasicUsage/style.css"
        }],
        html: [],
        js: [{
            name: "script.js",
            label: "script.js",
            fileType: "js",
            outputPath: "demo-partials/whiteframe/demoBasicUsage/script.js"
        }],
        moduleName: "material.components.whiteframe",
        name: "demoBasicUsage",
        label: "Basic Usage",
        index: {
            name: "index.html",
            label: "index.html",
            fileType: "html",
            outputPath: "demo-partials/whiteframe/demoBasicUsage/index.html"
        },
        ngModule: {
            module: "whiteframeBasicUsage",
            dependencies: ["ngMaterial"]
        }
    }],
    url: "/demo/material.components.whiteframe"
}]), DocsApp.directive("layoutAlign", function() {
    return angular.noop
}).directive("layout", function() {
    return angular.noop
}).directive("docsDemo", ["$mdUtil", function(e) {
    function t(e, t, n, o) {
        function a(e) {
            switch (e) {
                case "index.html":
                    return "HTML";
                case "script.js":
                    return "JS";
                case "style.css":
                    return "CSS";
                default:
                    return e
            }
        }
        var i = this;
        i.interpolateCode = angular.isDefined(n.interpolateCode), i.demoId = o(n.demoId || "")(e.$parent), i.demoTitle = o(n.demoTitle || "")(e.$parent), i.demoModule = o(n.demoModule || "")(e.$parent), i.files = {
            css: [],
            js: [],
            html: []
        }, i.addFile = function(e, t) {
            var n = {
                name: a(e),
                contentsPromise: t,
                fileType: e.split(".").pop()
            };
            t.then(function(e) {
                n.contents = e
            }), "index.html" === e ? i.files.index = n : "readme.html" === e ? i.demoDescription = n : (i.files[n.fileType] = i.files[n.fileType] || [], i.files[n.fileType].push(n)), i.orderedFiles = [].concat(i.files.index || []).concat(i.files.js || []).concat(i.files.css || []).concat(i.files.html || [])
        }
    }
    return {
        restrict: "E",
        scope: !0,
        templateUrl: "partials/docs-demo.tmpl.html",
        transclude: !0,
        controller: ["$scope", "$element", "$attrs", "$interpolate", t],
        controllerAs: "demoCtrl",
        bindToController: !0
    }
}]).directive("demoFile", ["$q", "$interpolate", function(e, t) {
    function n(n, o) {
        var a = o.contents,
            i = n.html(),
            r = o.name;
        return n.contents().remove(),
            function(n, o, l, d) {
                d.addFile(t(r)(n), e.when(n.$eval(a) || i)), o.remove()
            }
    }
    return {
        restrict: "E",
        require: "^docsDemo",
        compile: n
    }
}]).filter("toHtml", ["$sce", function(e) {
    return function(t) {
        return e.trustAsHtml(t)
    }
}]), DocsApp.directive("demoInclude", ["$q", "$http", "$compile", "$templateCache", "$timeout", function(e, t, n, o, a) {
    function i(t, o, i) {
        function r() {
            c.index.contentsPromise.then(function(a) {
                s = angular.element('<div class="demo-content ' + m + '">');
                var i, r, c = !!m;
                c ? (angular.bootstrap(s[0], [m]), i = s.scope(), r = s.injector().get("$compile"), t.$on("$destroy", function() {
                    i.$destroy()
                })) : (i = t.$new(), r = n), e.all([l(), d()])["finally"](function() {
                    i.$evalAsync(function() {
                        o.append(s), s.html(a), r(s.contents())(i)
                    })
                })
            })
        }

        function l() {
            return e.all(c.css.map(function(e) {
                return e.contentsPromise
            })).then(function(e) {
                e = e.join("\n");
                var n = angular.element("<style>" + e + "</style>");
                document.body.appendChild(n[0]), t.$on("$destroy", function() {
                    n.remove()
                })
            })
        }

        function d() {
            return e.all(c.html.map(function(e) {
                return e.contentsPromise.then(function(n) {
                    var o = s.injector().get("$templateCache");
                    o.put(e.name, n), t.$on("$destroy", function() {
                        o.remove(e.name)
                    })
                })
            }))
        }
        var s, c = t.$eval(i.files) || {},
            m = t.$eval(i.module) || "";
        a(r)
    }
    return {
        restrict: "E",
        link: i
    }
}]), angular.module("docsApp").run(["$templateCache", function(e) {
    e.put("partials/demo.tmpl.html", '<docs-demo ng-repeat="demo in demos" \n  demo-id="{{demo.id}}" demo-title="{{demo.label}}" demo-module="{{demo.ngModule.module}}">\n  <demo-file ng-repeat="file in demo.$files"\n             name="{{file.name}}" contents="file.httpPromise">\n  </demo-file>\n</docs-demo>\n')
}]), angular.module("docsApp").run(["$templateCache", function(e) {
    e.put("partials/docs-demo.tmpl.html", '<div layout="column" class="doc-content">\n  <div flex layout="column" style="z-index:1">\n\n    <div class="doc-description" ng-bind-html="demoCtrl.demoDescription.contents | toHtml"></div>\n\n    <div ng-transclude></div>\n\n    <section class="demo-container md-whiteframe-z1"\n      ng-class="{\'show-source\': demoCtrl.$showSource}" >\n\n      <md-toolbar class="demo-toolbar">\n        <div class="md-toolbar-tools">\n          <h3>{{demoCtrl.demoTitle}}</h3>\n          <span flex></span>\n          <md-button\n            style="min-width: 72px; margin-left: auto;"\n            ng-click="demoCtrl.$showSource = !demoCtrl.$showSource">\n            <div flex layout="row" layout-align="center center">\n              <md-icon md-svg-src="img/icons/ic_visibility_24px.svg"\n                 style="margin: 0 4px 0 0;">\n              </md-icon>\n              Source\n            </div>\n          </md-button>\n        </div>\n      </md-toolbar>\n\n      <!-- Source views -->\n      <md-tabs class="demo-source-tabs" ng-show="demoCtrl.$showSource" style="min-height: 0;">\n        <md-tab ng-repeat="file in demoCtrl.orderedFiles" label="{{file.name}}">\n          <md-content md-scroll-y class="demo-source-container">\n            <hljs class="no-header" code="file.contentsPromise" lang="{{file.fileType}}" should-interpolate="demoCtrl.interpolateCode">\n            </hljs>\n          </md-content>\n        </md-tab>\n      </md-tabs>\n\n      <!-- Live Demos -->\n      <demo-include files="demoCtrl.files" module="demoCtrl.demoModule" class="{{demoCtrl.demoId}}">\n      </demo-include>\n    </section>\n\n  </div>\n</div>\n')
}]), angular.module("docsApp").run(["$templateCache", function(e) {
    e.put("partials/getting-started.tmpl.html", '<div ng-controller="GuideCtrl" layout="column" class="doc-content">\n  <md-content>\n    <p><em>New to Angular.js? Before getting into Angular Material, it might be helpful to\n      <a href="https://egghead.io/articles/new-to-angularjs-start-learning-here" target="_blank"\n         title="Link opens in a new window">read about the framework</a>.</em></p>\n\n    <h2>How do I start?</h2>\n    <ul style="margin-bottom: 2em;">\n      <li><a href="http://codepen.io/collection/AxKKgY/" target="_blank"\n             title="Link opens in a new window">Fork a Codepen</a></li>\n      <li><a href="https://github.com/angular/material-start" target="_blank"\n             title="Link opens in a new window">Clone a Github Starter Project</a></li>\n    </ul>\n\n    <h3>Including Angular Material and its dependencies</h3>\n    <ul style="margin-bottom: 2em;">\n      <li><a href="https://github.com/angular/material#bower">Using Bower</a></li>\n      <li><a href="https://github.com/angular/material#cdn">Using a CDN</a> (example below)</li>\n    </ul>\n\n    <iframe height=\'272\' scrolling=\'no\' data-default-tab="html"\n            src=\'//codepen.io/marcysutton/embed/OPbpKm?height=272&theme-id=11083\'\n            frameborder=\'no\' allowtransparency=\'true\' allowfullscreen=\'true\' style=\'width: 100%;\'>\n      See the Pen <a href=\'http://codepen.io/marcysutton/pen/OPbpKm/\'>Angular Material Dependencies</a>\n      on <a href=\'http://codepen.io\'>CodePen</a>.\n    </iframe>\n\n    <md-divider></md-divider>\n\n    <h2>Contributing to Angular Material</h2>\n    <ul style="margin-bottom: 2em;">\n      <li>To contribute, fork our GitHub <a href="https://github.com/angular/material">repository</a>.</li>\n      <li>Please read our <a href="https://github.com/angular/material#contributing">contributor guidelines</a>.</li>\n      <li>For problems,\n          <a href="https://github.com/angular/material/issues?q=is%3Aissue+is%3Aopen" target="_blank">\n              search the issues\n          </a> and/or\n          <a href="https://github.com/angular/material/issues/new" target="_blank">\n              create a new issue\n          </a>.\n      </li>\n      <li>For questions,\n          <a href="https://groups.google.com/forum/#!forum/ngmaterial" target="_blank">\n              search the forum\n          </a> and/or post a new message.\n      </li>\n    </ul>\n  </md-content>\n</div>\n');

}]), angular.module("docsApp").run(["$templateCache", function(e) {
    e.put("partials/home.tmpl.html", '<div ng-controller="HomeCtrl" layout="column" class="doc-content">\n    <md-content>\n        <p>The <strong>Angular Material</strong> project is an implementation of Material Design in Angular.js. This project provides a set of reusable, well-tested, and accessible UI components based on the Material Design system.</p>\n\n        <p>Similar to the\n            <a href="http://www.polymer-project.org/">Polymer</a> project\'s\n            <a href="http://www.polymer-project.org/docs/elements/paper-elements.html">Paper elements</a> collection, Angular Material is supported internally at Google by the Angular.js, Material Design UX and other product teams.\n        </p>\n\n        <ul class="buckets" layout layout-align="center center" layout-wrap>\n          <li flex="25" flex-md="50" flex-sm="50">\n            <md-card>\n              <md-card-content>\n                <a ng-href="#/getting-started">Getting Started</a>\n              </md-card-content>\n            </md-card>\n          </li>\n          <li flex="25" flex-md="50" flex-sm="50">\n            <md-card>\n              <md-card-content>\n                <a ng-href="#/demo/">Demos</a>\n              </md-card-content>\n            </md-card>\n          </li>\n          <li flex="25" flex-md="50" flex-sm="50">\n            <md-card>\n              <md-card-content>\n                <a ng-href="#/CSS/typography">Customization</a>\n              </md-card-content>\n            </md-card>\n          </li>\n          <li flex="25" flex-md="50" flex-sm="50">\n            <md-card>\n              <md-card-content>\n                <a ng-href="#/api/">API Reference</a>\n              </md-card-content>\n            </md-card>\n          </li>\n        </ul>\n\n        <h2 class="md-title">What is Material Design?</h2>\n        <p>\n            <a href="http://www.google.com/design/spec/material-design/">Material Design</a> is a specification for a\n            unified system of visual, motion, and interaction design that adapts across different devices and different\n            screen sizes.\n\n            Below is a brief video that presents the Material Design system:\n        </p>\n\n        <md-content>\n          <div style="max-width: 560px; margin: 0 auto;">\n            <div class="responsive-video">\n              <iframe title="Material Design" src="//www.youtube.com/embed/Q8TXgCzxEnw" frameborder="0" allowfullscreen></iframe>\n            </div>\n          </div>\n        </md-content>\n        <ul>\n            <li>These docs were generated from source in the `master` branch:\n                <ul style="padding-top:5px;">\n                    <li>\n                        at commit <a ng-href="{{BUILDCONFIG.repository}}/commit/{{BUILDCONFIG.commit}}" target="_blank">\n                        v{{BUILDCONFIG.version}}  -  SHA {{BUILDCONFIG.commit.substring(0,7)}}\n                    </a>.\n                    </li>\n                    <li>\n                        on {{BUILDCONFIG.date}} GMT.\n                    </li>\n                </ul>\n\n            </li>\n        </ul>\n        <br/>\n        <br/>\n    </md-content>\n</div>\n\n')
}]), angular.module("docsApp").run(["$templateCache", function(e) {
    e.put("partials/layout-alignment.tmpl.html", '<div ng-controller="LayoutCtrl" layout="column" layout-fill class="layout-content">\n\n  <p>\n    The <code>layout-align</code> attribute takes two words.\n    The first word says how the children will be aligned in the layout\'s direction, and the second word says how the children will be aligned perpindicular to the layout\'s direction.</p>\n\n    <p>Only one word is required for the attribute. For example, <code>layout="row" layout-align="center"</code> would make the elements center horizontally and use the default behavior vertically.</p>\n\n    <p><code>layout="column" layout-align="center end"</code> would make\n    children align along the center vertically and along the end (right) horizontally.</p>\n  <table>\n    <tr>\n      <td>layout-align</td>\n      <td>Sets child alignment.</td>\n    </tr>\n    <tr>\n      <td>layout-align-sm</td>\n      <td>Sets child alignment on devices less than 600px wide.</td>\n    </tr>\n    <tr>\n      <td>layout-align-gt-sm</td>\n      <td>Sets child alignment on devices greater than 600px wide.</td>\n    </tr>\n    <tr>\n      <td>layout-align-md</td>\n      <td>Sets child alignment on devices between 600px and 960px wide.</td>\n    </tr>\n    <tr>\n      <td>layout-align-gt-md</td>\n      <td>Sets child alignment on devices greater than 960px wide.\n    </tr>\n    <tr>\n      <td>layout-align-lg</td>\n      <td>Sets child alignment on devices between 960px and 1200px wide.</td>\n    </tr>\n    <tr>\n      <td>layout-align-gt-lg</td>\n      <td>Sets child alignment on devices greater than 1200px wide.</td>\n    </tr>\n  </table>\n  <p>\n   See below for more examples:\n  </p>\n\n  <section class="layout-panel-parent">\n    <div ng-panel="layoutDemo">\n      <docs-demo demo-title=\'layout="{{layoutDemo.direction}}" layout-align="{{layoutAlign()}}"\' class="small-demo" interpolate-code="true">\n        <demo-file name="index.html">\n          <div layout="{{layoutDemo.direction}}" layout-align="{{layoutAlign()}}">\n            <div>one</div>\n            <div>two</div>\n            <div>three</div>\n          </div>\n        </demo-file>\n      </docs-demo>\n    </div>\n  </section>\n\n  <div layout="column" layout-gt-sm="row" layout-align="space-around">\n\n    <div>\n      <md-subheader>Layout Direction</md-subheader>\n      <md-radio-group ng-model="layoutDemo.direction">\n        <md-radio-button value="row">row</md-radio-button>\n        <md-radio-button value="column">column</md-radio-button>\n      </md-radio-group>\n    </div>\n    <div>\n      <md-subheader>Alignment in Layout Direction ({{layoutDemo.direction == \'row\' ? \'horizontal\' : \'vertical\'}})</md-subheader>\n      <md-radio-group ng-model="layoutDemo.mainAxis">\n        <md-radio-button value="start">start</md-radio-button>\n        <md-radio-button value="center">center</md-radio-button>\n        <md-radio-button value="end">end</md-radio-button>\n        <md-radio-button value="space-around">space-around</md-radio-button>\n        <md-radio-button value="space-between">space-between</md-radio-button>\n      </md-radio-group>\n    </div>\n    <div>\n      <md-subheader>Alignment in Perpendicular Direction ({{layoutDemo.direction == \'column\' ? \'horizontal\' : \'vertical\'}})</md-subheader>\n      <md-radio-group ng-model="layoutDemo.crossAxis">\n        <md-radio-button value="start">start</md-radio-button>\n        <md-radio-button value="center">center</md-radio-button>\n        <md-radio-button value="end">end</md-radio-button>\n      </md-radio-group>\n    </div>\n\n  </div>\n</div>\n')
}]), angular.module("docsApp").run(["$templateCache", function(e) {
    e.put("partials/layout-container.tmpl.html", '<div ng-controller="LayoutCtrl" layout="column" layout-fill class="layout-content">\n\n  <h3>Overview</h3>\n  <p>\n    Angular Material\'s responsive CSS layout is built on\n    <a href="http://www.w3.org/TR/css3-flexbox/">flexbox</a>.\n  </p>\n\n  <p>\n    The layout system is based upon element attributes rather than CSS classes.\n    Attributes provide an easy way to set a value (eg <code>layout="row"</code>), and additionally\n    helps us separate concerns: attributes define layout, and classes define styling.\n  </p>\n\n  <md-divider></md-divider>\n  <h3>Layout Attribute</h3>\n  <p>\n    Use the <code>layout</code> attribute on an element to arrange its children\n    horizontally in a row (<code>layout="row"</code>), or vertically in\n    a column (<code>layout="column"</code>). \n  </p>\n\n  <hljs lang="html">\n    <div layout="row">\n      <div>I\'m left.</div>\n      <div>I\'m right.</div>\n    </div>\n    <div layout="column">\n      <div>I\'m above.</div>\n      <div>I\'m below.</div>\n    </div>\n  </hljs>\n\n  <p>\n    See <a href="#/layout/options">Layout Options</a> for information on responsive layouts and other options.\n  </p>\n</div>\n')
}]), angular.module("docsApp").run(["$templateCache", function(e) {
    e.put("partials/layout-grid.tmpl.html", '<div ng-controller="LayoutCtrl" layout="column" layout-fill class="layout-content">\n\n  <p>\n    To customize the size and position of elements in a layout, use the\n    <code>flex</code>, <code>offset</code>, and <code>flex-order</code> attributes.\n  </p>\n\n  <md-divider></md-divider>\n\n  <docs-demo demo-title="Flex Attribute" class="small-demo">\n    <demo-file name="index.html">\n      <div layout="row">\n        <div flex>\n          [flex]\n        </div>\n        <div flex>\n          [flex]\n        </div>\n        <div flex hide-sm>\n          [flex]\n        </div>\n      </div>\n    </demo-file>\n  </docs-demo>\n  <p>\n    Add the <code>flex</code> attribute to a layout\'s child element, and it\n    will flex (stretch) to fill the available area.\n  </p>\n\n\n  <md-divider></md-divider>\n\n  <docs-demo demo-title="Flex Percent Values" class="small-demo">\n    <demo-file name="index.html">\n      <div layout="row" layout-wrap>\n        <div flex="33">\n          [flex="33"]\n        </div>\n        <div flex="55">\n          [flex="55"]\n        </div>\n        <div flex>\n          [flex]\n        </div>\n        <div flex="66">\n          [flex]\n        </div>\n        <div flex="33">\n          [flex]\n        </div>\n      </div>\n    </demo-file>\n  </docs-demo>\n  <p>\n    A layout child\'s <code>flex</code> attribute can be given an integer value from 0-100.\n    The element will stretch to the percentage of available space matching the value.\n    <br/><br/>\n    The <code>flex</code> attribute value is restricted to 33, 66, and multiples\n    of five.\n    <br/>\n    For example: <code>flex="5", flex="20", "flex="33", flex="50", flex="66", flex="75", ...</code>.\n  </p>\n  <p>\n  See the <a href="#/layout/options">layout options page</a> for more information on responsive flex attributes.\n  </p>\n\n  <md-divider></md-divider>\n  <docs-demo demo-title="Flex Order Attribute" class="small-demo">\n    <demo-file name="index.html">\n      <div layout="row" layout-margin>\n        <div flex flex-order="3">\n          [flex-order="3"]\n        </div>\n        <div flex flex-order="2">\n          [flex-order="2"]\n        </div>\n        <div flex flex-order="1">\n          [flex-order="1"]\n        </div>\n      </div>\n    </demo-file>\n  </docs-demo>\n  <p>\n    Add the <code>flex-order</code> attribute to a layout child to set its\n    position within the layout. Any value from 0-9 is accepted.\n  </p>\n  <table>\n    <tr>\n      <td>flex-order</td>\n      <td>Sets element order.</td>\n    </tr>\n    <tr>\n      <td>flex-order-sm</td>\n      <td>Sets element order on devices less than 600px wide.</td>\n    </tr>\n    <tr>\n      <td>flex-order-gt-sm</td>\n      <td>Sets element order on devices greater than 600px wide.</td>\n    </tr>\n    <tr>\n      <td>flex-order-md</td>\n      <td>Sets element order on devices between 600px and 960px wide.</td>\n    </tr>\n    <tr>\n      <td>flex-order-gt-md</td>\n      <td>Sets element order on devices greater than 960px wide.\n    </tr>\n    <tr>\n      <td>flex-order-lg</td>\n      <td>Sets element order on devices between 960px and 1200px wide.</td>\n    </tr>\n    <tr>\n      <td>flex-order-gt-lg</td>\n      <td>Sets element order on devices greater than 1200px wide.</td>\n    </tr>\n  </table>\n  <md-divider></md-divider>\n  <docs-demo demo-title="Flex Offset Attribute" class="small-demo">\n    <demo-file name="index.html">\n      <div layout="row">\n        <div flex offset="33">\n          [flex offset="33"]\n        </div>\n        <div flex>\n          [flex]\n        </div>\n      </div>\n    </demo-file>\n  </docs-demo>\n  <p>\n    Add the <code>offset</code> attribute to a layout child to set its\n    offset percentage within the layout. Values must be multiples \n    of <code>5</code>, or <code>33</code>, <code>34</code>, <code>66</code>, <code>67</code>.\n  </p>\n  <table>\n    <tr>\n      <td>offset</td>\n      <td>Sets element offset.</td>\n    </tr>\n    <tr>\n      <td>offset-sm</td>\n      <td>Sets element offset on devices less than 600px wide.</td>\n    </tr>\n    <tr>\n      <td>offset-gt-sm</td>\n      <td>Sets element offset on devices greater than 600px wide.</td>\n    </tr>\n    <tr>\n      <td>offset-md</td>\n      <td>Sets element offset on devices between 600px and 960px wide.</td>\n    </tr>\n    <tr>\n      <td>offset-gt-md</td>\n      <td>Sets element offset on devices greater than 960px wide.\n    </tr>\n    <tr>\n      <td>offset-lg</td>\n      <td>Sets element offset on devices between 960px and 1200px wide.</td>\n    </tr>\n    <tr>\n      <td>offset-gt-lg</td>\n      <td>Sets element offset on devices greater than 1200px wide.</td>\n    </tr>\n  </table>\n</div>\n\n')
}]), angular.module("docsApp").run(["$templateCache", function(e) {
    e.put("partials/layout-options.tmpl.html", '<div ng-controller="LayoutCtrl" layout="column" layout-fill class="layout-content layout-options">\n\n  <docs-demo demo-title="Responsive Layout" class="small-demo">\n    <demo-file name="index.html">\n      <div layout="row" layout-sm="column">\n        <div flex>\n          I\'m above on mobile, and to the left on larger devices.\n        </div>\n        <div flex>\n          I\'m below on mobile, and to the right on larger devices.\n        </div>\n      </div>\n    </demo-file>\n  </docs-demo>\n\n  <p>\n    See the <a href="#/layout/container">Layout Container</a> page for a basic explanation\n    of layout attributes.\n    <br/>\n    To make your layout change depending upon the device size, there are\n    other <code>layout</code> attributes available:\n  </p>\n\n  <table>\n    <tr>\n      <td>layout</td>\n      <td>Sets the default layout on all devices.</td>\n    </tr>\n    <tr>\n      <td>layout-sm</td>\n      <td>Sets the layout on devices less than 600px wide (phones).</td>\n    </tr>\n    <tr>\n      <td>layout-gt-sm</td>\n      <td>Sets the layout on devices greater than 600px wide (bigger than phones).</td>\n    </tr>\n    <tr>\n      <td>layout-md</td>\n      <td>Sets the layout on devices between 600px and 960px wide (tablets in portrait).</td>\n    </tr>\n    <tr>\n      <td>layout-gt-md</td>\n      <td>Sets the layout on devices greater than 960px wide (bigger than tablets in portrait).</td>\n    </tr>\n    <tr>\n      <td>layout-lg</td>\n      <td>Sets the layout on devices between 960 and 1200px wide (tablets in landscape).</td>\n    </tr>\n    <tr>\n      <td>layout-gt-lg</td>\n      <td>Sets the layout on devices greater than 1200px wide (computers and large screens).</td>\n    </tr>\n  </table>\n  <br/>\n\n  <md-divider></md-divider>\n\n  <docs-demo demo-title="Layout Margin, Padding and Fill" class="small-demo">\n    <demo-file name="index.html">\n      <div layout="row" layout-margin layout-fill layout-padding>\n        <div flex>I\'m on the left, and there\'s an empty area around me.</div>\n        <div flex>I\'m on the right, and there\'s an empty area around me.</div>\n      </div>\n    </demo-file>\n  </docs-demo>\n\n  <p>\n    <code>layout-margin</code> adds margin around each <code>flex</code> child. It also adds a margin to the layout container itself.\n    <br/>\n    <code>layout-padding</code> adds padding inside each <code>flex</code> child. It also adds padding to the layout container itself.\n    <br/>\n    <code>layout-fill</code> forces the layout element to fill its parent container.\n  </p>\n\n  <br/>\n\n  <md-divider></md-divider>\n\n  <docs-demo demo-title="Wrap" class="small-demo">\n    <demo-file name="index.html">\n      <div layout="row" layout-wrap>\n        <div flex="33">[flex=33]</div>\n        <div flex="66">[flex=66]</div>\n        <div flex="66">[flex=66]</div>\n        <div flex="33">[flex=33]</div>\n      </div>\n    </demo-file>\n  </docs-demo>\n  <p>\n    <code>layout-wrap</code> allows <code>flex</code> children to wrap within the container if the elements use more than 100%.\n    <br/>\n  </p>\n\n  <br/>\n\n  <md-divider></md-divider>\n\n  <docs-demo demo-title="Responsive Flex & Offset Attributes" class="small-demo">\n    <demo-file name="index.html">\n      <div layout="row">\n        <div flex="66" flex-sm="33">\n          I flex to one-third of the space on mobile, and two-thirds on other devices.\n        </div>\n        <div flex="33" flex-sm="66">\n          I flex to two-thirds of the space on mobile, and one-third on other devices.\n        </div>\n      </div>\n    </demo-file>\n  </docs-demo>\n\n  <p>\n    See the <a href="#/layout/grid">Layout Grid</a> page for a basic explanation\n    of flex and offset attributes.\n  </p>\n\n  <table>\n    <tr>\n      <td>flex</td>\n      <td>Sets flex.</td>\n    </tr>\n    <tr>\n      <td>flex-sm</td>\n      <td>Sets flex on devices less than 600px wide.</td>\n    </tr>\n    <tr>\n      <td>flex-gt-sm</td>\n      <td>Sets flex on devices greater than 600px wide.</td>\n    </tr>\n    <tr>\n      <td>flex-md</td>\n      <td>Sets flex on devices between 600px and 960px wide..</td>\n    </tr>\n    <tr>\n      <td>flex-gt-md</td>\n      <td>Sets flex on devices greater than 960px wide.\n    </tr>\n    <tr>\n      <td>flex-lg</td>\n      <td>Sets flex on devices between 960px and 1200px.</td>\n    </tr>\n    <tr>\n      <td>flex-gt-lg</td>\n      <td>Sets flex on devices greater than 1200px wide.</td>\n    </tr>\n  </table>\n\n  <md-divider></md-divider>\n\n  <docs-demo demo-title="Hide and Show Attributes" class="small-demo">\n    <demo-file name="index.html">\n      <div layout layout-align="center center">\n        <md-subheader hide-sm>\n          I\'m hidden on mobile and shown on larger devices.\n        </md-subheader>\n        <md-subheader hide-gt-sm>\n          I\'m shown on mobile and hidden on larger devices.\n        </md-subheader>\n      </div>\n    </demo-file>\n  </docs-demo>\n  <br/>\n  <table>\n    <tr>\n      <td>hide</td>\n      <td><code>display: none</code></td>\n    </tr>\n    <tr>\n      <td>hide-sm</td>\n      <td><code>display: none</code> on devices less than 600px wide.</td>\n    </tr>\n    <tr>\n      <td>hide-gt-sm</td>\n      <td><code>display: none</code> on devices greater than 600px wide.</td>\n    </tr>\n    <tr>\n      <td>hide-md</td>\n      <td><code>display: none</code> on devices between 600px and 960px wide.</td>\n    </tr>\n    <tr>\n      <td>hide-gt-md</td>\n      <td><code>display: none</code> on devices greater than 960px wide.\n    </tr>\n    <tr>\n      <td>hide-lg</td>\n      <td><code>display: none</code> on devices between 960px and 1200px.</td>\n    </tr>\n    <tr>\n      <td>hide-gt-lg</td>\n      <td><code>display: none</code> on devices greater than 1200px wide.</td>\n    </tr>\n    <tr>\n      <td>show</td>\n      <td>Negates hide.</td>\n    </tr>\n    <tr>\n      <td>show-sm</td>\n      <td>Negates hide on devices less than 600px wide.</td>\n    </tr>\n    <tr>\n      <td>show-gt-sm</td>\n      <td>Negates hide on devices greater than 600px wide.</td>\n    </tr>\n    <tr>\n      <td>show-md</td>\n      <td>Negates hide on devices between 600px and 960px wide..</td>\n    </tr>\n    <tr>\n      <td>show-gt-md</td>\n      <td>Negates hide on devices greater than 960px wide.\n    </tr>\n    <tr>\n      <td>show-lg</td>\n      <td>Negates hide on devices between 960px and 1200px.</td>\n    </tr>\n    <tr>\n      <td>show-gt-lg</td>\n      <td>Negates hide on devices greater than 1200px wide.</td>\n    </tr>\n  </table>\n\n</div>\n')
}]), angular.module("docsApp").run(["$templateCache", function(e) {
    e.put("partials/menu-link.tmpl.html", '<md-button ng-class="{\'active\' : isSelected()}"\n  ng-href="#{{section.url}}" ng-click="focusSection()">\n  {{section | humanizeDoc}}\n  <span class="md-visually-hidden"\n    ng-if="isSelected()">\n    current page\n  </span>\n</md-button>\n')
}]), angular.module("docsApp").run(["$templateCache", function(e) {
    e.put("partials/menu-toggle.tmpl.html", '<md-button class="md-button-toggle"\n  ng-click="toggle()"\n  aria-controls="docs-menu-{{section.name | nospace}}"\n  aria-expanded="{{isOpen()}}">\n  <div flex layout="row">\n    {{section.name}}\n    <span flex=""></span>\n    <span aria-hidden="true" class="md-toggle-icon"\n    ng-class="{\'toggled\' : isOpen()}">\n      <md-icon md-svg-src="toggle-arrow"></md-icon>\n    </span>\n  </div>\n  <span class="md-visually-hidden">\n    Toggle {{isOpen()? \'expanded\' : \'collapsed\'}}\n  </span>\n</md-button>\n\n<ul ng-show="isOpen()" id="docs-menu-{{section.name | nospace}}" class="menu-toggle-list">\n  <li ng-repeat="page in section.pages">\n    <menu-link section="page"></menu-link>\n  </li>\n</ul>\n')
}]), angular.module("docsApp").run(["$templateCache", function(e) {
    e.put("partials/view-source.tmpl.html", '<md-dialog class="view-source-dialog">\n\n  <md-tabs>\n    <md-tab ng-repeat="file in files"\n                  active="file === data.selectedFile"\n                  ng-click="data.selectedFile = file" >\n        <span class="window_label">{{file.viewType}}</span>\n    </md-tab>\n  </md-tabs>\n\n  <div class="md-content" md-scroll-y flex>\n    <div ng-repeat="file in files">\n      <hljs code="file.content"\n        lang="{{file.fileType}}"\n        ng-show="file === data.selectedFile" >\n      </hljs>\n    </div>\n  </div>\n\n  <div class="md-actions" layout="horizontal">\n    <md-button class="md-button-light" ng-click="$hideDialog()">\n      Done\n    </md-button>\n  </div>\n</md-dialog>\n')
}]), DocsApp.directive("hljs", ["$timeout", "$q", "$interpolate", function(e, t, n) {
    return {
        restrict: "E",
        compile: function(o, a) {
            var i;
            return a.code || (i = o.html(), o.empty()),
                function(o, a, r) {
                    function l(e, t) {
                        var n = t.find("code"),
                            o = e.split("\n");
                        o = o.filter(function(e) {
                            return e.trim().length
                        });
                        var a = o[0].match(/^\s*/)[0],
                            i = new RegExp("^" + a);
                        o = o.map(function(e) {
                            return e.replace(i, "").replace(/\s+$/, "")
                        });
                        var l = hljs.highlight(r.language || r.lang, o.join("\n"), !0);
                        l.value = l.value.replace(/=<span class="hljs-value">""<\/span>/gi, "").replace("<head>", "").replace("<head/>", ""), n.append(l.value).addClass("highlight")
                    }
                    r.code && (i = o.$eval(r.code));
                    var d = o.$eval(r.shouldInterpolate);
                    t.when(i).then(function(t) {
                        if (t) {
                            d && (t = n(t)(o));
                            var i = angular.element('<pre><code class="highlight" ng-non-bindable></code></pre>');
                            a.append(i), e(function() {
                                l(t, i)
                            }, 34, !1)
                        }
                    })
                }
        }
    }
}]);
var hljs = new function() {
    function e(e) {
        return e.replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;")
    }

    function t(e) {
        return e.nodeName.toLowerCase()
    }

    function n(e, t) {
        var n = e && e.exec(t);
        return n && 0 == n.index
    }

    function o(e) {
        var t = (e.className + " " + (e.parentNode ? e.parentNode.className : "")).split(/\s+/);
        return t = t.map(function(e) {
            return e.replace(/^lang(uage)?-/, "")
        }), t.filter(function(e) {
            return b(e) || "no-highlight" == e
        })[0]
    }

    function a(e, t) {
        var n = {};
        for (var o in e) n[o] = e[o];
        if (t)
            for (var o in t) n[o] = t[o];
        return n
    }

    function i(e) {
        var n = [];
        return function o(e, a) {
            for (var i = e.firstChild; i; i = i.nextSibling) 3 == i.nodeType ? a += i.nodeValue.length : "br" == t(i) ? a += 1 : 1 == i.nodeType && (n.push({
                event: "start",
                offset: a,
                node: i
            }), a = o(i, a), n.push({
                event: "stop",
                offset: a,
                node: i
            }));
            return a
        }(e, 0), n
    }

    function r(n, o, a) {
        function i() {
            return n.length && o.length ? n[0].offset != o[0].offset ? n[0].offset < o[0].offset ? n : o : "start" == o[0].event ? n : o : n.length ? n : o
        }

        function r(n) {
            function o(t) {
                return " " + t.nodeName + '="' + e(t.value) + '"'
            }
            c += "<" + t(n) + Array.prototype.map.call(n.attributes, o).join("") + ">"
        }

        function l(e) {
            c += "</" + t(e) + ">"
        }

        function d(e) {
            ("start" == e.event ? r : l)(e.node)
        }
        for (var s = 0, c = "", m = []; n.length || o.length;) {
            var u = i();
            if (c += e(a.substr(s, u[0].offset - s)), s = u[0].offset, u == n) {
                m.reverse().forEach(l);
                do d(u.splice(0, 1)[0]), u = i(); while (u == n && u.length && u[0].offset == s);
                m.reverse().forEach(r)
            } else "start" == u[0].event ? m.push(u[0].node) : m.pop(), d(u.splice(0, 1)[0])
        }
        return c + e(a.substr(s))
    }

    function l(e) {
        function t(e) {
            return e && e.source || e
        }

        function n(n, o) {
            return RegExp(t(n), "m" + (e.cI ? "i" : "") + (o ? "g" : ""))
        }

        function o(i, r) {
            if (!i.compiled) {
                if (i.compiled = !0, i.k = i.k || i.bK, i.k) {
                    var l = {},
                        d = function(t, n) {
                            e.cI && (n = n.toLowerCase()), n.split(" ").forEach(function(e) {
                                var n = e.split("|");
                                l[n[0]] = [t, n[1] ? Number(n[1]) : 1]
                            })
                        };
                    "string" == typeof i.k ? d("keyword", i.k) : Object.keys(i.k).forEach(function(e) {
                        d(e, i.k[e])
                    }), i.k = l
                }
                i.lR = n(i.l || /\b[A-Za-z0-9_]+\b/, !0), r && (i.bK && (i.b = "\\b(" + i.bK.split(" ").join("|") + ")\\b"), i.b || (i.b = /\B|\b/), i.bR = n(i.b), i.e || i.eW || (i.e = /\B|\b/), i.e && (i.eR = n(i.e)), i.tE = t(i.e) || "", i.eW && r.tE && (i.tE += (i.e ? "|" : "") + r.tE)), i.i && (i.iR = n(i.i)), void 0 === i.r && (i.r = 1), i.c || (i.c = []);
                var s = [];
                i.c.forEach(function(e) {
                    e.v ? e.v.forEach(function(t) {
                        s.push(a(e, t))
                    }) : s.push("self" == e ? i : e)
                }), i.c = s, i.c.forEach(function(e) {
                    o(e, i)
                }), i.starts && o(i.starts, r);
                var c = i.c.map(function(e) {
                    return e.bK ? "\\.?(" + e.b + ")\\.?" : e.b
                }).concat([i.tE, i.i]).map(t).filter(Boolean);
                i.t = c.length ? n(c.join("|"), !0) : {
                    exec: function(e) {
                        return null
                    }
                }, i.continuation = {}
            }
        }
        o(e)
    }

    function d(t, o, a, i) {
        function r(e, t) {
            for (var o = 0; o < t.c.length; o++)
                if (n(t.c[o].bR, e)) return t.c[o]
        }

        function c(e, t) {
            return n(e.eR, t) ? e : e.eW ? c(e.parent, t) : void 0
        }

        function m(e, t) {
            return !a && n(t.iR, e)
        }

        function u(e, t) {
            var n = C.cI ? t[0].toLowerCase() : t[0];
            return e.k.hasOwnProperty(n) && e.k[n]
        }

        function p(e, t, n, o) {
            var a = o ? "" : v.classPrefix,
                i = '<span class="' + a,
                r = n ? "" : "</span>";
            return i += e + '">', i + t + r
        }

        function h() {
            if (!T.k) return e(A);
            var t = "",
                n = 0;
            T.lR.lastIndex = 0;
            for (var o = T.lR.exec(A); o;) {
                t += e(A.substr(n, o.index - n));
                var a = u(T, o);
                a ? (w += a[1], t += p(a[0], e(o[0]))) : t += e(o[0]), n = T.lR.lastIndex, o = T.lR.exec(A)
            }
            return t + e(A.substr(n))
        }

        function f() {
            if (T.sL && !E[T.sL]) return e(A);
            var t = T.sL ? d(T.sL, A, !0, T.continuation.top) : s(A);
            return T.r > 0 && (w += t.r), "continuous" == T.subLanguageMode && (T.continuation.top = t.top), p(t.language, t.value, !1, !0)
        }

        function g() {
            return void 0 !== T.sL ? f() : h()
        }

        function M(t, n) {
            var o = t.cN ? p(t.cN, "", !0) : "";
            t.rB ? ($ += o, A = "") : t.eB ? ($ += e(n) + o, A = "") : ($ += o, A = n), T = Object.create(t, {
                parent: {
                    value: T
                }
            })
        }

        function y(t, n) {
            if (A += t, void 0 === n) return $ += g(), 0;
            var o = r(n, T);
            if (o) return $ += g(), M(o, n), o.rB ? 0 : n.length;
            var a = c(T, n);
            if (a) {
                var i = T;
                i.rE || i.eE || (A += n), $ += g();
                do T.cN && ($ += "</span>"), w += T.r, T = T.parent; while (T != a.parent);
                return i.eE && ($ += e(n)), A = "", a.starts && M(a.starts, ""), i.rE ? 0 : n.length
            }
            if (m(n, T)) throw new Error('Illegal lexeme "' + n + '" for mode "' + (T.cN || "<unnamed>") + '"');
            return A += n, n.length || 1
        }
        var C = b(t);
        if (!C) throw new Error('Unknown language: "' + t + '"');
        l(C);
        for (var T = i || C, $ = "", x = T; x != C; x = x.parent) x.cN && ($ += p(x.cN, $, !0));
        var A = "",
            w = 0;
        try {
            for (var k, N, S = 0;;) {
                if (T.t.lastIndex = S, k = T.t.exec(o), !k) break;
                N = y(o.substr(S, k.index - S), k[0]), S = k.index + N
            }
            y(o.substr(S));
            for (var x = T; x.parent; x = x.parent) x.cN && ($ += "</span>");
            return {
                r: w,
                value: $,
                language: t,
                top: T
            }
        } catch (_) {
            if (-1 != _.message.indexOf("Illegal")) return {
                r: 0,
                value: e(o)
            };
            throw _
        }
    }

    function s(t, n) {
        n = n || v.languages || Object.keys(E);
        var o = {
                r: 0,
                value: e(t)
            },
            a = o;
        return n.forEach(function(e) {
            if (b(e)) {
                var n = d(e, t, !1);
                n.language = e, n.r > a.r && (a = n), n.r > o.r && (a = o, o = n)
            }
        }), a.language && (o.second_best = a), o
    }

    function c(e) {
        return v.tabReplace && (e = e.replace(/^((<[^>]+>|\t)+)/gm, function(e, t, n, o) {
            return t.replace(/\t/g, v.tabReplace)
        })), v.useBR && (e = e.replace(/\n/g, "<br>")), e
    }

    function m(e) {
        var t = v.useBR ? e.innerHTML.replace(/\n/g, "").replace(/<br>|<br [^>]*>/g, "\n").replace(/<[^>]*>/g, "") : e.textContent,
            n = o(e);
        if ("no-highlight" != n) {
            var a = n ? d(n, t, !0) : s(t),
                l = i(e);
            if (l.length) {
                var m = document.createElementNS("http://www.w3.org/1999/xhtml", "pre");
                m.innerHTML = a.value, a.value = r(l, i(m), t)
            }
            a.value = c(a.value), e.innerHTML = a.value, e.className += " hljs " + (!n && a.language || ""), e.result = {
                language: a.language,
                re: a.r
            }, a.second_best && (e.second_best = {
                language: a.second_best.language,
                re: a.second_best.r
            })
        }
    }

    function u(e) {
        v = a(v, e)
    }

    function p() {
        if (!p.called) {
            p.called = !0;
            var e = document.querySelectorAll("pre code");
            Array.prototype.forEach.call(e, m)
        }
    }

    function h() {
        addEventListener("DOMContentLoaded", p, !1), addEventListener("load", p, !1)
    }

    function f(e, t) {
        var n = E[e] = t(this);
        n.aliases && n.aliases.forEach(function(t) {
            M[t] = e
        })
    }

    function g() {
        return Object.keys(E)
    }

    function b(e) {
        return E[e] || E[M[e]]
    }
    var v = {
            classPrefix: "hljs-",
            tabReplace: null,
            useBR: !1,
            languages: void 0
        },
        E = {},
        M = {};
    this.highlight = d, this.highlightAuto = s, this.fixMarkup = c, this.highlightBlock = m, this.configure = u, this.initHighlighting = p, this.initHighlightingOnLoad = h, this.registerLanguage = f, this.listLanguages = g, this.getLanguage = b, this.inherit = a, this.IR = "[a-zA-Z][a-zA-Z0-9_]*", this.UIR = "[a-zA-Z_][a-zA-Z0-9_]*", this.NR = "\\b\\d+(\\.\\d+)?", this.CNR = "(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", this.BNR = "\\b(0b[01]+)", this.RSR = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", this.BE = {
        b: "\\\\[\\s\\S]",
        r: 0
    }, this.ASM = {
        cN: "string",
        b: "'",
        e: "'",
        i: "\\n",
        c: [this.BE]
    }, this.QSM = {
        cN: "string",
        b: '"',
        e: '"',
        i: "\\n",
        c: [this.BE]
    }, this.PWM = {
        b: /\b(a|an|the|are|I|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such)\b/
    }, this.CLCM = {
        cN: "comment",
        b: "//",
        e: "$",
        c: [this.PWM]
    }, this.CBCM = {
        cN: "comment",
        b: "/\\*",
        e: "\\*/",
        c: [this.PWM]
    }, this.HCM = {
        cN: "comment",
        b: "#",
        e: "$",
        c: [this.PWM]
    }, this.NM = {
        cN: "number",
        b: this.NR,
        r: 0
    }, this.CNM = {
        cN: "number",
        b: this.CNR,
        r: 0
    }, this.BNM = {
        cN: "number",
        b: this.BNR,
        r: 0
    }, this.CSSNM = {
        cN: "number",
        b: this.NR + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
        r: 0
    }, this.RM = {
        cN: "regexp",
        b: /\//,
        e: /\/[gim]*/,
        i: /\n/,
        c: [this.BE, {
            b: /\[/,
            e: /\]/,
            r: 0,
            c: [this.BE]
        }]
    }, this.TM = {
        cN: "title",
        b: this.IR,
        r: 0
    }, this.UTM = {
        cN: "title",
        b: this.UIR,
        r: 0
    }
};
hljs.registerLanguage("javascript", function(e) {
    return {
        aliases: ["js"],
        k: {
            keyword: "in if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const class",
            literal: "true false null undefined NaN Infinity",
            built_in: "eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document"
        },
        c: [{
            cN: "pi",
            b: /^\s*('|")use strict('|")/,
            r: 10
        }, e.ASM, e.QSM, e.CLCM, e.CBCM, e.CNM, {
            b: "(" + e.RSR + "|\\b(case|return|throw)\\b)\\s*",
            k: "return throw case",
            c: [e.CLCM, e.CBCM, e.RM, {
                b: /</,
                e: />;/,
                r: 0,
                sL: "xml"
            }],
            r: 0
        }, {
            cN: "function",
            bK: "function",
            e: /\{/,
            eE: !0,
            c: [e.inherit(e.TM, {
                b: /[A-Za-z$_][0-9A-Za-z$_]*/
            }), {
                cN: "params",
                b: /\(/,
                e: /\)/,
                c: [e.CLCM, e.CBCM],
                i: /["'\(]/
            }],
            i: /\[|%/
        }, {
            b: /\$[(.]/
        }, {
            b: "\\." + e.IR,
            r: 0
        }]
    }
}), hljs.registerLanguage("css", function(e) {
    var t = "[a-zA-Z-][a-zA-Z0-9_-]*",
        n = {
            cN: "function",
            b: t + "\\(",
            rB: !0,
            eE: !0,
            e: "\\("
        };
    return {
        cI: !0,
        i: "[=/|']",
        c: [e.CBCM, {
            cN: "id",
            b: "\\#[A-Za-z0-9_-]+"
        }, {
            cN: "class",
            b: "\\.[A-Za-z0-9_-]+",
            r: 0
        }, {
            cN: "attr_selector",
            b: "\\[",
            e: "\\]",
            i: "$"
        }, {
            cN: "pseudo",
            b: ":(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\\"\\']+"
        }, {
            cN: "at_rule",
            b: "@(font-face|page)",
            l: "[a-z-]+",
            k: "font-face page"
        }, {
            cN: "at_rule",
            b: "@",
            e: "[{;]",
            c: [{
                cN: "keyword",
                b: /\S+/
            }, {
                b: /\s/,
                eW: !0,
                eE: !0,
                r: 0,
                c: [n, e.ASM, e.QSM, e.CSSNM]
            }]
        }, {
            cN: "tag",
            b: t,
            r: 0
        }, {
            cN: "rules",
            b: "{",
            e: "}",
            i: "[^\\s]",
            r: 0,
            c: [e.CBCM, {
                cN: "rule",
                b: "[^\\s]",
                rB: !0,
                e: ";",
                eW: !0,
                c: [{
                    cN: "attribute",
                    b: "[A-Z\\_\\.\\-]+",
                    e: ":",
                    eE: !0,
                    i: "[^\\s]",
                    starts: {
                        cN: "value",
                        eW: !0,
                        eE: !0,
                        c: [n, e.CSSNM, e.QSM, e.ASM, e.CBCM, {
                            cN: "hexcolor",
                            b: "#[0-9A-Fa-f]+"
                        }, {
                            cN: "important",
                            b: "!important"
                        }]
                    }
                }]
            }]
        }]
    }
}), hljs.registerLanguage("xml", function(e) {
    var t = "[A-Za-z0-9\\._:-]+",
        n = {
            b: /<\?(php)?(?!\w)/,
            e: /\?>/,
            sL: "php",
            subLanguageMode: "continuous"
        },
        o = {
            eW: !0,
            i: /</,
            r: 0,
            c: [n, {
                cN: "attribute",
                b: t,
                r: 0
            }, {
                b: "=",
                r: 0,
                c: [{
                    cN: "value",
                    v: [{
                        b: /"/,
                        e: /"/
                    }, {
                        b: /'/,
                        e: /'/
                    }, {
                        b: /[^\s\/>]+/
                    }]
                }]
            }]
        };
    return {
        aliases: ["html", "xhtml", "rss", "atom", "xsl", "plist"],
        cI: !0,
        c: [{
            cN: "doctype",
            b: "<!DOCTYPE",
            e: ">",
            r: 10,
            c: [{
                b: "\\[",
                e: "\\]"
            }]
        }, {
            cN: "comment",
            b: "<!--",
            e: "-->",
            r: 10
        }, {
            cN: "cdata",
            b: "<\\!\\[CDATA\\[",
            e: "\\]\\]>",
            r: 10
        }, {
            cN: "tag",
            b: "<style(?=\\s|>|$)",
            e: ">",
            k: {
                title: "style"
            },
            c: [o],
            starts: {
                e: "</style>",
                rE: !0,
                sL: "css"
            }
        }, {
            cN: "tag",
            b: "<script(?=\\s|>|$)",
            e: ">",
            k: {
                title: "script"
            },
            c: [o],
            starts: {
                e: "</script>",
                rE: !0,
                sL: "javascript"
            }
        }, {
            b: "<%",
            e: "%>",
            sL: "vbscript"
        }, n, {
            cN: "pi",
            b: /<\?\w+/,
            e: /\?>/,
            r: 10
        }, {
            cN: "tag",
            b: "</?",
            e: "/?>",
            c: [{
                cN: "title",
                b: "[^ /><]+",
                r: 0
            }, o]
        }]
    }
}), DocsApp.directive("ngPanel", ["$animate", function(e) {
    return {
        restrict: "EA",
        transclude: "element",
        terminal: !0,
        compile: function(t, n) {
            var o = n.ngPanel || n["for"],
                a = /^(\S+)(?:\s+track by (.+?))?$/,
                i = a.exec(o),
                r = !0,
                l = i[1],
                d = i[2];
            return d ? r = !1 : d = i[1],
                function(t, n, o, a, i) {
                    var s, c;
                    t[r ? "$watchCollection" : "$watch"](d, function(o) {
                        s && e.leave(s), c && (c.$destroy(), c = null);
                        r ? o : t.$eval(l);
                        c = t.$new(), i(c, function(t) {
                            s = t, e.enter(t, null, n)
                        })
                    })
                }
        }
    }
}]), DocsApp.constant("SERVICES", [{
    name: "$mdMedia",
    type: "service",
    outputPath: "partials/api/material.core/service/$mdMedia.html",
    url: "api/material.core/service/$mdMedia",
    label: "$mdMedia",
    hasDemo: !1,
    module: "material.core",
    githubUrl: "https://github.com/angular/material/blob/master/src/core/services//material.core.js"
}]);