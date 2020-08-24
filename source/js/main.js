var cardViewer;
var photo = {
    loadGallery: function () {
        if (document.getElementById("gallery-content")) {
            new Viewer(document.getElementById("gallery-content"), {toolbar: true,})
        }
        if (typeof ($.fn.justifiedGallery) === "function") {
            if ($(".justified-gallery > p > .gallery-item").length) {
                $(".justified-gallery > p > .gallery-item").unwrap()
            }
            $(".justified-gallery").justifiedGallery({rowHeight: 230, margins: 4})
        }
    }, showPhotos: function () {
        $("div.gallery-cards").on("click", function () {
            var galleryArea = $("#galleryArea");
            var cards = $(this);
            var itemIndex = cards.attr("itemIndex");
            var galleryAreaIndex = galleryArea.attr("itemIndex");
            galleryArea.remove();
            if (itemIndex === galleryAreaIndex) {
                photo.restoreGalleryCard(galleryArea);
                return
            }
            photo.appendEle(this, itemIndex);
            var childCard = cards.children().children();
            galleryArea = $("#galleryArea");
            galleryArea.toggleClass("justified-gallery");
            galleryArea.append(childCard.clone());
            galleryArea.find(".content").each(function () {
                $(this).toggleClass("hidden")
            });
            if (typeof ($.fn.justifiedGallery) === "function") {
                galleryArea.find(".gallery-item").each(function () {
                    $(this).unwrap()
                });
                galleryArea.justifiedGallery({
                    rowHeight: 230,
                    margins: 4,
                    cssAnimation: true,
                    imagesAnimationDuration: 1000,
                })
            }
            cardViewer = new Viewer(document.getElementById("galleryArea"), {toolbar: true,})
        })
    }, appendEle: function (thisEle, itemIndex) {
        var galleryCards = $("#galleryCards");
        var cardLen = galleryCards.children().length;
        var cardsIndex = $("#galleryCards .gallery-cards").index(thisEle);
        var screenWidth = document.documentElement.clientWidth;
        var element;
        var left = "30%";
        if (screenWidth >= 1024) {
            element = '<div class="gallery-area col-span-4 gallery-area-bg transition duration-500 ease-in-out" id="galleryArea" itemIndex=' + itemIndex + "></div>";
            photo.doAppendDiv(cardsIndex, cardLen, 4, element, thisEle);
            left = (cardsIndex + 1) % 4 * 18 + "%"
        } else {
            if (screenWidth >= 768 && screenWidth < 1024) {
                element = '<div class="gallery-area col-span-3 gallery-area-bg transition duration-500 ease-in-out" id="galleryArea" itemIndex=' + itemIndex + "></div>";
                photo.doAppendDiv(cardsIndex, cardLen, 3, element, thisEle);
                left = (cardsIndex + 1) % 3 * 20 + "%"
            } else {
                if (screenWidth >= 640 && screenWidth < 768) {
                    element = '<div class="gallery-area gallery-area-bg col-span-2 transition duration-500 ease-in-out" id="galleryArea" itemIndex=' + itemIndex + "></div>";
                    if ((cardsIndex + 1) % 2 === 0) {
                        $(thisEle).after(element)
                    } else {
                        $(thisEle).next().after(element)
                    }
                    left = (cardsIndex + 1) % 2 * 20 + "%";
                    if (left === "0%") {
                        left = "70%"
                    }
                } else {
                    element = '<div class="gallery-area gallery-area-bg transition duration-500 ease-in-out" id="galleryArea" itemIndex=' + itemIndex + "></div>";
                    $(thisEle).after(element)
                }
            }
        }
        if (left === "0%") {
            left = "85%"
        }
        console.log(left);
        var style = document.querySelector(".gallery-area").style;
        style.setProperty("--left", left)
    }, doAppendDiv: function (cardsIndex, cardLen, size, element, thisEle) {
        if ((cardsIndex + 1) % size === 0 || cardsIndex + 1 === cardLen) {
            $(thisEle).after(element)
        } else {
            var addNumber = (size - (cardsIndex + 1) % size);
            var lastEle;
            if (cardsIndex + addNumber >= cardLen) {
                lastEle = $("#galleryCards .gallery-cards").eq(cardLen - 1);
                $(lastEle).after(element)
            } else {
                lastEle = $("#galleryCards .gallery-cards").eq(cardsIndex + addNumber);
                $(lastEle).after(element)
            }
        }
    }, restoreGalleryCard: function (galleryArea) {
        if (typeof ($.fn.justifiedGallery) === "function") {
            galleryArea.justifiedGallery("destroy")
        }
        if (cardViewer) {
            cardViewer.destroy()
        }
        cardViewer = null
    }
};
$(function () {
    photo.showPhotos()
});
document.addEventListener("DOMContentLoaded", photo.loadGallery);
var hanUtils = {
    getLocalStorage: function (key) {
        var exp = 60 * 60 * 1000;
        if (localStorage.getItem(key)) {
            var vals = localStorage.getItem(key);
            var dataObj = JSON.parse(vals);
            var isTimed = (new Date().getTime() - dataObj.timer) > exp;
            if (isTimed) {
                console.log("存储已过期");
                localStorage.removeItem(key);
                return null
            } else {
                var newValue = dataObj.val
            }
            return newValue
        } else {
            return null
        }
    }, isQuotaExceeded: function (e) {
        var quotaExceeded = false;
        if (e) {
            if (e.code) {
                switch (e.code) {
                    case 22:
                        quotaExceeded = true;
                        break;
                    case 1014:
                        if (e.name === "NS_ERROR_DOM_QUOTA_REACHED") {
                            quotaExceeded = true
                        }
                        break
                }
            } else {
                if (e.number === -2147024882) {
                    quotaExceeded = true
                }
            }
        }
        return quotaExceeded
    }, setLocalStorage: function (key, value) {
        var curtime = new Date().getTime();
        var valueDate = JSON.stringify({val: value, timer: curtime});
        try {
            localStorage.removeItem(key);
            localStorage.setItem(key, valueDate)
        } catch (e) {
            if (isQuotaExceeded(e)) {
                console.log("Error: 本地存储超过限制");
                localStorage.clear()
            } else {
                console.log("Error: 保存到本地存储失败")
            }
        }
    }, sheetViewer: function () {
        if (document.getElementById("write")) {
            const viewer = new Viewer(document.getElementById("write"), {toolbar: false,})
        }
    }, journalViewer: function () {
        if (document.getElementById("tree-hole")) {
            const viewer = new Viewer(document.getElementById("tree-hole"), {
                toolbar: false, filter: function (image) {
                    if (!image.classList) {
                        return true
                    }
                    return !image.classList.contains("avatar")
                },
            })
        }
    }, highlightMenu: function () {
        var nav = document.getElementById("menuLinks");
        var links = nav.getElementsByClassName("link");
        var currenturl = document.location.pathname;
        var last = 0;
        if (links) {
            for (var i = 0; i < links.length; i++) {
                var linkurl = links[i].getAttribute("href");
                if (currenturl.indexOf(linkurl) !== -1) {
                    if (currenturl.indexOf(linkurl) !== -1) {
                        last = i
                    }
                }
            }
            $(links[last]).addClass("current");
            for (var i = 0; i < links.length; i++) {
                if (last !== i) {
                    $(links[i]).removeClass("current")
                }
            }
        }
    }, tableAddNode: function () {
        var postContent = document.getElementById("write");
        if (!postContent) {
            return
        }
        var tables = postContent.getElementsByTagName("table");
        if (tables) {
            for (var i = 0; i < tables.length; i++) {
                var table = tables[i];
                $(table).wrap('<div class="md-table"></div>')
            }
        }
    }, liAddSpan: function () {
        $("#write li").each(function (i) {
            if (this.classList.length > 0) {
            } else {
                if ($(this).find("p").length > 0 || $(this).find("div").length > 0) {
                } else {
                    var liContent = $(this).html();
                    liContent = liContent.trim();
                    var len = liContent.length;
                    if (len > 0) {
                        if (liContent.indexOf("<") === 0 && liContent.lastIndexOf(">") === len - 1) {
                        } else {
                            $(this).html("<span>" + liContent + "</span>")
                        }
                    }
                }
            }
        })
    }, documentClick: function () {
        $(document).click(function (e) {
            var target = e.target;
            var coffeeModal = $("#coffeeModal");
            if (coffeeModal && coffeeModal.hasClass("is-open")) {
                if ($(target).closest("#modalContainer").length === 0 && $(target).closest("#buyCoffee").length === 0) {
                    $("#closeCoffeeModalBtn").trigger("click")
                }
            }
            var moonMenu = $("#moonMenu");
            if (moonMenu && moonMenu.hasClass("active")) {
                if ($(target).closest(".moon-menu").length === 0) {
                    $(".moon-menu-button").trigger("click")
                }
            }
        })
    }, menuBgFFF: function () {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var postHeader = $("#navHeader");
        if (scrollTop > 0 && postHeader) {
            postHeader.addClass("nav-bg-fff");
            postHeader.addClass("nav-box-sd")
        } else {
            postHeader.removeClass("nav-bg-fff");
            postHeader.addClass("nav-box-sd")
        }
    }, scrollMenuShow: function () {
        window.addEventListener("scroll", hanUtils.menuBgFFF, false)
    }
};
$(function () {
    hanUtils.sheetViewer();
    hanUtils.journalViewer();
    hanUtils.highlightMenu();
    hanUtils.tableAddNode();
    hanUtils.liAddSpan();
    hanUtils.documentClick();
    hanUtils.scrollMenuShow()
});
var nightModeId = "nightMode";
var nightMode = {
    clickNightMode: function () {
        $("#switch_Word").on("change", function () {
            var isChecked = $("#switch_Word").prop("checked");
            nightMode.changeNightMode(isChecked)
        })
    }, changeNightMode: function (checked) {
        checked = !!checked;
        if (checked) {
            $(document.body).addClass("night");
            hanUtils.setLocalStorage(nightModeId, true);
            $("#switch_Word").attr("checked", true)
        } else {
            $(document.body).removeClass("night");
            hanUtils.setLocalStorage(nightModeId, false);
            $("#switch_Word").attr("checked", false)
        }
        if (typeof renderComment === "function") {
            renderComment()
        }
    }, autoNightMode: function () {
        var day = new Date();
        var hour = day.getHours();
        var isNight = hanUtils.getLocalStorage(nightModeId);
        if ((hour < 6 || hour >= 20) && autoNightModeOpen) {
            nightMode.changeNightMode(isNight)
        } else {
            nightMode.changeNightMode(isNight)
        }
    },
};
$(function () {
    nightMode.clickNightMode();
    nightMode.autoNightMode()
});
var coffeeModal = {
    toggleCoffeeModal: function () {
        $("#buyCoffee").on("click", function () {
            var coffeeModal = $("#coffeeModal");
            coffeeModal.addClass("is-open");
            coffeeModal.attr("aria-hidden", "false")
        });
        $("#closeCoffeeModalBtn").on("click", function () {
            var coffeeModal = $("#coffeeModal");
            coffeeModal.attr("aria-hidden", "true");
            setTimeout(function () {
                coffeeModal.removeClass("is-open")
            }, 200)
        })
    }, initShowCode: function () {
        var firstCode = $("#coffeeModalContent").children(":first");
        if (firstCode) {
            firstCode.addClass("qr-code-visible");
            var codeData = firstCode.attr("code-data");
            $("#coffeeModalTitle").text(codeData)
        }
    }, switchQrCode: function () {
        $("#zfbBtn").on("click", function (e) {
            var $qrCodeZfb = $("#qrCodeZfb");
            $qrCodeZfb.addClass("qr-code-visible");
            $("#qrCodeWx").removeClass("qr-code-visible");
            $("#coffeeModalTitle").text("支付宝");
            e.stopPropagation()
        });
        $("#wxBtn").on("click", function (e) {
            var $qrCodeWx = $("#qrCodeWx");
            $qrCodeWx.addClass("qr-code-visible");
            $("#qrCodeZfb").removeClass("qr-code-visible");
            $("#coffeeModalTitle").text("微信支付");
            e.stopPropagation()
        })
    }, hideModal: function () {
        var coffeeModal = $("#coffeeModal");
        coffeeModal.attr("aria-hidden", "true");
        setTimeout(function () {
            coffeeModal.removeClass("is-open")
        }, 200)
    }
};
$(function () {
    coffeeModal.toggleCoffeeModal();
    coffeeModal.initShowCode();
    coffeeModal.switchQrCode()
});
var moonMenu = {
    smoothBack2Top: function () {
        window.scroll({top: 0, behavior: "smooth"})
    }, smoothBack2Bottom: function () {
        const offsetHeight = document.documentElement.offsetHeight;
        const scrollHeight = document.documentElement.scrollHeight;
        window.scroll({top: scrollHeight - offsetHeight, behavior: "smooth"})
    }, ckBack2Top: function () {
        $(".icon-up").on("click", function () {
            $("#moonToc").removeClass("mm-active");
            moonMenu.smoothBack2Top()
        })
    }, ckBack2Bottom: function () {
        $(".icon-down").on("click", function () {
            $("#moonToc").removeClass("mm-active");
            moonMenu.smoothBack2Bottom()
        })
    }, ckShowContent: function () {
        $(".icon-toc").on("click", function () {
            $("#moonToc").toggleClass("mm-active");
            $(".moon-menu-button").trigger("click")
        })
    }, initMoonToc: function () {
        var headerEl = "h1,h2,h3,h4,h5,h6", content = ".md-content";
        tocbot.init({
            tocSelector: "#moonToc",
            contentSelector: content,
            headingSelector: headerEl,
            scrollSmooth: true,
            isCollapsedClass: "",
            headingsOffset: 0 - ($("#postHeader").height() + 58),
            scrollSmoothOffset: -60,
            hasInnerContainers: false,
        })
    }, searchBox: function () {
        $(".icon-search").on("click", function () {
            $("#searchBox").toggleClass("hidden")
        });
        $(".sh-exit").on("click", function () {
            $("#searchBox").toggleClass("hidden")
        })
    }, toggleCircle: function () {
        var $moonDot = $("g.moon-dot");
        var firstCircle = $moonDot.children("circle:first");
        var lastCircle = $moonDot.children("circle:last");
        var cy = $(firstCircle).attr("cy");
        if (cy === "0") {
            $(firstCircle).attr("cx", "0");
            $(firstCircle).attr("cy", "-.8rem");
            $(lastCircle).attr("cx", "0");
            $(lastCircle).attr("cy", ".8rem")
        } else {
            $(firstCircle).attr("cx", "-.8rem");
            $(firstCircle).attr("cy", "0");
            $(lastCircle).attr("cx", ".8rem");
            $(lastCircle).attr("cy", "0")
        }
    }, ckMoonButton: function () {
        $(".moon-menu-button").on("click", function () {
            moonMenu.toggleCircle();
            $(".moon-menu-items").toggleClass("item-ani")
        })
    },
};
$(function () {
    moonMenu.ckMoonButton();
    moonMenu.ckBack2Top();
    moonMenu.ckBack2Bottom();
    moonMenu.searchBox();
    var Obj = $("#tocFlag");
    if (Obj.length !== 1) {
        return false
    }
    moonMenu.initMoonToc();
    moonMenu.ckShowContent()
});