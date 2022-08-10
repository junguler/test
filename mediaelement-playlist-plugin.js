"use strict";

(function($) {
    $.extend(mejs.MepDefaults, {
        loopText: "Repeat On/Off",
        shuffleText: "Shuffle On/Off",
        nextText: "Next Track",
        prevText: "Previous Track",
        playlistText: "Show/Hide Playlist",
        fullscreenText: "Show/Hide Fullscreen"
    });
    $.extend(MediaElementPlayer.prototype, {
        buildloop: function(player, controls, layers, media) {
            var t = this;
            var loop = $('<div class="mejs-button mejs-loop-button ' + (player.options.loopplaylist ? "mejs-loop-on" : "mejs-loop-off") + '">' + '<button type="button" aria-controls="' + player.id + '" title="' + player.options.loopText + '"></button>' + "</div>").appendTo(controls).click(function() {
                player.options.loopplaylist = !player.options.loopplaylist;
                $(media).trigger("mep-looptoggle", [ player.options.loopplaylist ]);
                if (player.options.loopplaylist) {
                    loop.removeClass("mejs-loop-off").addClass("mejs-loop-on");
                } else {
                    loop.removeClass("mejs-loop-on").addClass("mejs-loop-off");
                }
            });
            t.loopToggle = t.controls.find(".mejs-loop-button");
        },
        loopToggleClick: function() {
            var t = this;
            t.loopToggle.trigger("click");
        },
        buildshuffle: function(player, controls, layers, media) {
            var t = this;
            var shuffle = $('<div class="mejs-button mejs-playlist-plugin-button mejs-shuffle-button ' + (player.options.shuffle ? "mejs-shuffle-on" : "mejs-shuffle-off") + '">' + '<button type="button" aria-controls="' + player.id + '" title="' + player.options.shuffleText + '"></button>' + "</div>").appendTo(controls).click(function() {
                player.options.shuffle = !player.options.shuffle;
                $(media).trigger("mep-shuffletoggle", [ player.options.shuffle ]);
                if (player.options.shuffle) {
                    shuffle.removeClass("mejs-shuffle-off").addClass("mejs-shuffle-on");
                } else {
                    shuffle.removeClass("mejs-shuffle-on").addClass("mejs-shuffle-off");
                }
            });
            t.shuffleToggle = t.controls.find(".mejs-shuffle-button");
        },
        shuffleToggleClick: function() {
            var t = this;
            t.shuffleToggle.trigger("click");
        },
        buildprevtrack: function(player, controls, layers, media) {
            var t = this;
            var prevTrack = $('<div class="mejs-button mejs-playlist-plugin-button mejs-prevtrack-button mejs-prevtrack">' + '<button type="button" aria-controls="' + player.id + '" title="' + player.options.prevText + '"></button>' + "</div>");
            prevTrack.appendTo(controls).click(function() {
                $(media).trigger("mep-playprevtrack");
                player.playPrevTrack();
            });
            t.prevTrack = t.controls.find(".mejs-prevtrack-button");
        },
        prevTrackClick: function() {
            var t = this;
            t.prevTrack.trigger("click");
        },
        buildnexttrack: function(player, controls, layers, media) {
            var t = this;
            var nextTrack = $('<div class="mejs-button mejs-playlist-plugin-button mejs-nexttrack-button mejs-nexttrack">' + '<button type="button" aria-controls="' + player.id + '" title="' + player.options.nextText + '"></button>' + "</div>");
            nextTrack.appendTo(controls).click(function() {
                $(media).trigger("mep-playnexttrack");
                player.playNextTrack();
            });
            t.nextTrack = t.controls.find(".mejs-nexttrack-button");
        },
        nextTrackClick: function() {
            var t = this;
            t.nextTrack.trigger("click");
        },
        buildplaylist: function(player, controls, layers, media) {
            var t = this;
            var playlistToggle = $('<div class="mejs-button mejs-playlist-plugin-button mejs-playlist-button ' + (player.options.playlist ? "mejs-hide-playlist" : "mejs-show-playlist") + '">' + '<button type="button" aria-controls="' + player.id + '" title="' + player.options.playlistText + '"></button>' + "</div>");
            playlistToggle.appendTo(controls).click(function() {
                t.togglePlaylistDisplay(player, layers, media);
            });
            t.playlistToggle = t.controls.find(".mejs-playlist-button");
        },
        playlistToggleClick: function() {
            var t = this;
            t.playlistToggle.trigger("click");
        },
        buildaudiofullscreen: function(player, controls, layers, media) {
            if (player.isVideo) {
                return;
            }
            var t = this;
            t.fullscreenBtn = $('<div class="mejs-button mejs-fullscreen-button">' + '<button type="button" aria-controls="' + t.id + '" title="' + t.options.fullscreenText + '" aria-label="' + t.options.fullscreenText + '"></button>' + "</div>");
            t.fullscreenBtn.appendTo(controls);
            var noIOSFullscreen = !mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.hasSemiNativeFullScreen && !t.media.webkitEnterFullscreen;
            if (t.media.pluginType === "native" && !noIOSFullscreen || !t.options.usePluginFullScreen && !mejs.MediaFeatures.isFirefox) {
                t.fullscreenBtn.click(function() {
                    var isFullScreen = mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen() || player.isFullScreen;
                    if (isFullScreen) {
                        player.exitFullScreen();
                    } else {
                        player.enterFullScreen();
                    }
                });
            } else {
                var fullscreenClass = "manual-fullscreen";
                t.fullscreenBtn.click(function() {
                    var isFullscreen = player.container.hasClass(fullscreenClass);
                    if (isFullscreen) {
                        $(document.body).removeClass(fullscreenClass);
                        player.container.removeClass(fullscreenClass);
                        player.resetSize();
                        t.isFullScreen = false;
                    } else {
                        t.normalHeight = t.container.height();
                        t.normalWidth = t.container.width();
                        $(document.body).addClass(fullscreenClass);
                        player.container.addClass(fullscreenClass);
                        t.container.css({
                            width: "100%",
                            height: "100%"
                        });
                        player.layers.children().css("width", "100%").css("height", "100%");
                        t.containerSizeTimeout = setTimeout(function() {
                            t.container.css({
                                width: "100%",
                                height: "100%"
                            });
                            player.layers.children().css("width", "100%").css("height", "100%");
                            t.setControlsSize();
                        }, 500);
                        player.setControlsSize();
                        t.isFullScreen = true;
                    }
                });
            }
        },
        buildplaylistfeature: function(player, controls, layers, media) {
            var t = this, playlist = $('<div class="mejs-playlist mejs-layer">' + '<ul class="mejs"></ul>' + "</div>").appendTo(layers);
            if (!!$(media).data("showplaylist")) {
                player.options.playlist = true;
                $("#" + player.id).find(".mejs-overlay-play").hide();
            }
            if (!player.options.playlist) {
                playlist.hide();
            }
            var getTrackName = function(trackUrl) {
                var trackUrlParts = trackUrl.split("/");
                if (trackUrlParts.length > 0) {
                    return decodeURIComponent(trackUrlParts[trackUrlParts.length - 1]);
                } else {
                    return "";
                }
            };
            var tracks = [], sourceIsPlayable, foundMatchingType = "";
            $("#" + player.id).find(".mejs-mediaelement source").each(function() {
                if ($(this).parent()[0] && $(this).parent()[0].canPlayType) {
                    sourceIsPlayable = $(this).parent()[0].canPlayType(this.type);
                } else if ($(this).parent()[0] && $(this).parent()[0].player && $(this).parent()[0].player.media && $(this).parent()[0].player.media.canPlayType) {
                    sourceIsPlayable = $(this).parent()[0].player.media.canPlayType(this.type);
                } else {
                    console.error("Cannot determine if we can play this media (no canPlayType()) on" + $(this).toString());
                }
                if (!foundMatchingType && (sourceIsPlayable === "maybe" || sourceIsPlayable === "probably")) {
                    foundMatchingType = this.type;
                }
                if (!!foundMatchingType && this.type === foundMatchingType) {
                    if ($.trim(this.src) !== "") {
                        var track = {};
                        track.source = $.trim(this.src);
                        if ($.trim(this.title) !== "") {
                            track.name = $.trim(this.title);
                        } else {
                            track.name = getTrackName(track.source);
                        }
                        track.poster = $(this).data("poster");
                        tracks.push(track);
                    }
                }
            });
            for (var track in tracks) {
                var $thisLi = $('<li data-url="' + tracks[track].source + '" data-poster="' + tracks[track].poster + '" title="' + tracks[track].name + '"><span>' + tracks[track].name + "</span></li>");
                layers.find(".mejs-playlist > ul").append($thisLi);
                if ($(player.media).hasClass("mep-slider")) {
                    $thisLi.css({
                        "background-image": 'url("' + $thisLi.data("poster") + '")'
                    });
                }
            }
            player.videoSliderTracks = tracks.length;
            layers.find("li:first").addClass("current played");
            if (!player.isVideo) {
                player.changePoster(layers.find("li:first").data("poster"));
            }
            var $prevVid = $('<a class="mep-prev">'), $nextVid = $('<a class="mep-next">');
            player.videoSliderIndex = 0;
            layers.find(".mejs-playlist").append($prevVid);
            layers.find(".mejs-playlist").append($nextVid);
            $("#" + player.id + ".mejs-container.mep-slider").find(".mejs-playlist ul li").css({
                transform: "translate3d(0, -20px, 0) scale3d(0.75, 0.75, 1)"
            });
            $prevVid.click(function() {
                var moveMe = true;
                player.videoSliderIndex -= 1;
                if (player.videoSliderIndex < 0) {
                    player.videoSliderIndex = 0;
                    moveMe = false;
                }
                if (player.videoSliderIndex === player.videoSliderTracks - 1) {
                    $nextVid.fadeOut();
                } else {
                    $nextVid.fadeIn();
                }
                if (player.videoSliderIndex === 0) {
                    $prevVid.fadeOut();
                } else {
                    $prevVid.fadeIn();
                }
                if (moveMe === true) {
                    player.sliderWidth = $("#" + player.id).width();
                    $("#" + player.id + ".mejs-container.mep-slider").find(".mejs-playlist ul li").css({
                        transform: "translate3d(-" + Math.ceil(player.sliderWidth * player.videoSliderIndex) + "px, -20px, 0) scale3d(0.75, 0.75, 1)"
                    });
                }
            }).hide();
            $nextVid.click(function() {
                var moveMe = true;
                player.videoSliderIndex += 1;
                if (player.videoSliderIndex > player.videoSliderTracks - 1) {
                    player.videoSliderIndex = player.videoSliderTracks - 1;
                    moveMe = false;
                }
                if (player.videoSliderIndex === player.videoSliderTracks - 1) {
                    $nextVid.fadeOut();
                } else {
                    $nextVid.fadeIn();
                }
                if (player.videoSliderIndex === 0) {
                    $prevVid.fadeOut();
                } else {
                    $prevVid.fadeIn();
                }
                if (moveMe === true) {
                    player.sliderWidth = $("#" + player.id).width();
                    $("#" + player.id + ".mejs-container.mep-slider").find(".mejs-playlist ul li").css({
                        transform: "translate3d(-" + Math.ceil(player.sliderWidth * player.videoSliderIndex) + "px, -20px, 0) scale3d(0.75, 0.75, 1)"
                    });
                }
            });
            layers.find(".mejs-playlist > ul li").click(function() {
                if (!$(this).hasClass("current")) {
                    $(this).addClass("played");
                    player.playTrack($(this));
                } else {
                    if (!player.media.paused) {
                        player.pause();
                    } else {
                        player.play();
                    }
                }
            });
            media.addEventListener("ended", function() {
                player.playNextTrack();
            }, false);
            media.addEventListener("playing", function() {
                player.container.removeClass("mep-paused").addClass("mep-playing");
                if (player.isVideo) {
                    t.togglePlaylistDisplay(player, layers, media, "hide");
                }
            }, false);
            media.addEventListener("play", function() {
                if (!player.isVideo) {
                    layers.find(".mejs-poster").show();
                }
            }, false);
            media.addEventListener("pause", function() {
                player.container.removeClass("mep-playing").addClass("mep-paused");
            }, false);
        },
        playNextTrack: function() {
            var t = this, nxt;
            var tracks = t.layers.find(".mejs-playlist > ul > li");
            var current = tracks.filter(".current");
            var notplayed = tracks.not(".played");
            if (notplayed.length < 1) {
                current.removeClass("played").siblings().removeClass("played");
                notplayed = tracks.not(".current");
            }
            var atEnd = false;
            if (t.options.shuffle) {
                var random = Math.floor(Math.random() * notplayed.length);
                nxt = notplayed.eq(random);
            } else {
                nxt = current.next();
                if (nxt.length < 1 && (t.options.loopplaylist || t.options.autoRewind)) {
                    nxt = current.siblings().first();
                    atEnd = true;
                }
            }
            t.options.loop = false;
            if (nxt.length == 1) {
                nxt.addClass("played");
                t.playTrack(nxt);
                t.options.loop = t.options.loopplaylist || t.options.continuous && !atEnd;
            }
        },
        playPrevTrack: function() {
            var t = this, prev;
            var tracks = t.layers.find(".mejs-playlist > ul > li");
            var current = tracks.filter(".current");
            var played = tracks.filter(".played").not(".current");
            if (played.length < 1) {
                current.removeClass("played");
                played = tracks.not(".current");
            }
            if (t.options.shuffle) {
                var random = Math.floor(Math.random() * played.length);
                prev = played.eq(random);
            } else {
                prev = current.prev();
                if (prev.length < 1 && t.options.loopplaylist) {
                    prev = current.siblings().last();
                }
            }
            if (prev.length == 1) {
                current.removeClass("played");
                t.playTrack(prev);
            }
        },
        changePoster: function(posterUrl) {
            var t = this;
            t.layers.find(".mejs-playlist").css("background-image", 'url("' + posterUrl + '")');
            t.setPoster(posterUrl);
            t.layers.find(".mejs-poster").show();
        },
        playTrack: function(track) {
            var t = this;
            t.pause();
            t.setSrc(track.data("url"));
            t.load();
            t.changePoster(track.data("poster"));
            t.play();
            track.addClass("current").siblings().removeClass("current");
        },
        playTrackURL: function(url) {
            var t = this;
            var tracks = t.layers.find(".mejs-playlist > ul > li");
            var track = tracks.filter('[data-url="' + url + '"]');
            t.playTrack(track);
        },
        togglePlaylistDisplay: function(player, layers, media, showHide) {
            var t = this;
            if (!!showHide) {
                player.options.playlist = showHide === "show" ? true : false;
            } else {
                player.options.playlist = !player.options.playlist;
            }
            $(media).trigger("mep-playlisttoggle", [ player.options.playlist ]);
            if (player.options.playlist) {
                layers.children(".mejs-playlist").fadeIn();
                t.playlistToggle.removeClass("mejs-show-playlist").addClass("mejs-hide-playlist");
            } else {
                layers.children(".mejs-playlist").fadeOut();
                t.playlistToggle.removeClass("mejs-hide-playlist").addClass("mejs-show-playlist");
            }
        },
        oldSetPlayerSize: MediaElementPlayer.prototype.setPlayerSize,
        setPlayerSize: function(width, height) {
            var oldIsVideo = this.isVideo;
            this.isVideo = true;
            this.oldSetPlayerSize(width, height);
            this.isVideo = oldIsVideo;
        }
    });
})(mejs.$);