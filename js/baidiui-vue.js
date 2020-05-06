var app, appData = {
		hash: {},
		url: {},
		resize: function(el, callback) {
			var _t = el;
			setTimeout(function() {
				typeof(callback) == 'function' ? callback(_t): null
			});
			var lastWidth = _t.width(),
				lastHeight = _t.height();
			var loop = self.setInterval(function() {
				if (lastWidth != _t.width() || lastHeight != _t.height()) {
					typeof(callback) == 'function' ? callback(_t): null
					lastWidth = _t.width();
					lastHeight = _t.height();
				}
			}, 300);
		},
		msg: {
			i: 1,
			add(options) {
				var _i = app.msg.i,
					_default = {
						content: '',
						icon: 'fa fa-lightbulb-o',
						color: 'turquoise',
						positions: 'top',
						timeout: 3000
					};
				Object.assign(_default, options);
				if ($('body').length != 0) {
					if ($('.bui-msg-box.bui-msg-box-' + _default.positions).length == 0) {
						$('body').append(
							'<div class="bui-msg-box bui-msg-box-' + _default.positions + '" style="">' +
							'	<div class="bui_p_12">' +
							'		<div class="bui_row_p_12"></div>' +
							'	</div>' +
							'</div>'
						);
						addMsgItem();
					} else {
						addMsgItem();
					}
				};

				function addMsgItem() {
					var _itemHtml = '' +
						'' +
						'<div class="bui-msg-item" positions="' + _default.positions + '" itemid="' + _i + '" style="opacity:0;">' +
						'	<div class="bui_p_12_tb bui_p_24_lr bui_bds_1 bui_bdc_' + _default.color + ' bui_bgc_' + _default.color +
						' bui_fc_' +
						_default.color + '" style="position:relative">' +
						'		<div class="bui_fc_white_h bui_cursor_p" style="position:absolute;z-index:2;right:0;top:0;font-size:12px;" onclick="app.msg.remove(' +
						_i + ')"><i class="fa fa-close fa-fw"></i></div>' +
						'		<div class="bui_flex_row bui_vt" style="position:relative;z-index:1;">' +
						(_default.icon ? '<div class="bui_flex_row_l bui_p_12_r"><i class="' + _default.icon + ' fa-fw"></i></div>' : '') +
						'			<div class="bui_flex_row_c">' + _default.content + '</div>' +
						'		</div>' +
						'		<div style="position:absolute;left:0;right:0;top:0;bottom:0;background-color:rgba(255,255,255,0.86);"></div>' +
						'	</div>' +
						'</div>';
					if (_default.positions == 'top' || _default.positions == 'center') {
						$(".bui-msg-box-" + _default.positions).children().children().append(_itemHtml);
						$(".bui-msg-item[itemid=" + _i + "]").addClass('bui_am_slideDownIn');
					} else if (_default.positions == 'bottom') {
						$(".bui-msg-box-" + _default.positions).children().children().prepend(_itemHtml);
						$(".bui-msg-item[itemid=" + _i + "]").addClass('bui_am_slideUpIn');
					};
					if (_default.timeout != 0) {
						setTimeout(function() {
							app.msg.remove(_i);
						}, _default.timeout);
					};

					app.msg.setSize();
					app.$set(app.msg, 'i', _i + 1);
				}
			},
			remove(id) {
				var _dom = $(".bui-msg-item[itemid=" + id + "]"),
					_positions = _dom.attr('positions');
				if (_positions == 'top' || _positions == 'center') {
					_dom.removeClass('bui_am_slideDownIn').addClass('bui_am_slideDownOut');
				} else if (_positions == 'bottom') {
					_dom.removeClass('bui_am_slideUpIn').addClass('bui_am_slideUpOut');
				};
				setTimeout(function() {
					_dom.remove();
					app.msg.setSize();
					if ($(".bui-msg-box-" + _positions).find('.bui-msg-item').length == 0) {
						$(".bui-msg-box-" + _positions).remove();
					}
				}, 300)
			},
			setSize(callback) {
				$(".bui-msg-box").css({
					'position': 'fixed',
					'left': $(window).width() > 480 ? '50%' : 0,
					'width': $(window).width() > 480 ? 480 : '100%',
					'margin-left': $(window).width() > 480 ? -240 : 0,
				});
				$(".bui-msg-box-top").css({
					'top': 0
				});
				$(".bui-msg-box-center").css({
					'margin-top': -[$(".bui-msg-box-center").height() / 2],
					'top': '50%'
				});
				$(".bui-msg-box-bottom").css({
					'bottom': 0
				});

				$(window).unbind('resize').bind('resize', function() {
					app.msg.setSize();
				})

				typeof(callback) == 'function' ? callback(): null;
			}
		},
		modal: {
			add: function(options) {
				var _t = this;
				var defaults = {
					setid: 'bui_modal_' + ($('[bui_modal]').length + 1), //默认设置弹窗ID
					header: 'default', //是否开启顶部
					footer: null, //是否开启底部
					boxClass: 'bui_bgc_white bui_shadow bui_shadow_24 bui_fc_black', //对话框样式类
					headerClass: 'bui_bds_1_b bui_bdc_silver_l', //对话框页头样式类名
					footerClass: 'bui_bds_1_t bui_bdc_silver_l', //对话框页脚样式类名
					positions: 'top', //默认显示方向
					effectIn: null, //进入动画
					effectOut: null, //离开动画
					title: 'Dialog', //默认标题
					content: '<div class="bui_p_24 bui_ta_c"><i class="fa fa-circle-o-notch fa-spin bui_fs_24 bui_fc_silver"></i></div>', //默认内容
					ajaxload: null, //是否开启ajax
					width: '480px', //默认宽度
					height: 'auto', //默认高度
					isClose: true, //是否可以关闭
					isRemove: true, //关闭后是否移除
					showAfter: function() {}, //开启回调
					closeAfter: function() {}, //关闭回调
					trueAfter: function(setObj) {}, //true回调
					falseAfter: function(setObj) {}, //true回调
				};
				var setObj = $.extend(defaults, options);

				//默认进入离开动画
				if (!setObj.effectIn) {
					if (setObj.positions.indexOf('side') != -1) {
						if (setObj.positions.indexOf('top') != -1) {
							setObj.effectIn = 'bui_am_slideDownIn'
						} else if (setObj.positions.indexOf('bottom') != -1) {
							setObj.effectIn = 'bui_am_slideUpIn'
						} else if (setObj.positions.indexOf('left') != -1) {
							setObj.effectIn = 'bui_am_slideRightIn'
						} else if (setObj.positions.indexOf('right') != -1) {
							setObj.effectIn = 'bui_am_slideLeftIn'
						}
					} else {
						if (setObj.positions.indexOf('top') != -1) {
							setObj.effectIn = 'bui_am_slideDownIn'
						} else if (setObj.positions.indexOf('bottom') != -1) {
							setObj.effectIn = 'bui_am_slideUpIn'
						} else {
							setObj.effectIn = 'bui_am_zoomIn'
						};
					};

				}
				if (!setObj.effectOut) {
					if (setObj.positions.indexOf('side') != -1) {
						if (setObj.positions.indexOf('top') != -1) {
							setObj.effectOut = 'bui_am_slideDownOut'
						} else if (setObj.positions.indexOf('bottom') != -1) {
							setObj.effectOut = 'bui_am_slideUpOut'
						} else if (setObj.positions.indexOf('left') != -1) {
							setObj.effectOut = 'bui_am_slideRightOut'
						} else if (setObj.positions.indexOf('right') != -1) {
							setObj.effectOut = 'bui_am_slideLeftOut'
						}
					} else {
						if (setObj.positions.indexOf('top') != -1) {
							setObj.effectOut = 'bui_am_slideDownOut'
						} else if (setObj.positions.indexOf('bottom') != -1) {
							setObj.effectOut = 'bui_am_slideUpOut'
						} else {
							setObj.effectOut = 'bui_am_zoomOut'
						};
					};
				};

				_t.setHtml(setObj); //插入模态对话框html
				//适应窗口
				$(window).bind('resize', function() {
					if ($("[bui_modal]").length > 0) {
						_t.resize();
					}
				});

			},
			setHtml: function(options) {
				var _t = this;
				//插入遮罩层
				if ($("[bui_modal_mask]").length == 0) {
					$("body").append(
						'<div bui_modal_mask class="bui_bgc_black_f" style="position:fixed;top:0;bottom:0;left:0;right:0;z-index:10000;"></div>'
					);
					$("[bui_modal_mask]").addClass('bui_am_fadeIn');
					if (options.isClose) {
						$("[bui_modal_mask]").attr('buijs_modal_close', true)
					}
				};
				//处理层级
				var zindex = $("[bui_modal][active='true']").length == 0 ? [Number($("[bui_modal_mask]:first").css('z-index')) + 1] :
					[Number($("[bui_modal]:first").css('z-index')) + 1];

				//页头页脚处理
				var headerHtml = '';
				if (!options.header) {
					options.headerClass = '';
					headerHtml = '';
				} else if (options.header == 'default') {
					var closeLabel = options.isClose == true ?
						'<div style="width:3rem;height:3rem;line-height:3rem" class="bui_ta_c bui_cursor_p bui_fc_silver_h" buijs_modal_close=' +
						options.setid +
						'><i class="fa fa-close"></i></div>' : '<div style="width:3rem;height:3rem;line-height:3rem"></div>';
					headerHtml = '<div class="bui_media bui_vm bui_ta_c">' +
						'	<div class="bui_media_l">' +
						'		<div style="width:3rem;height:3rem;line-height:3rem"></div>' +
						'	</div>' +
						'	<div class="bui_media_b">' +
						'		<p>' + options.title + '</p>' +
						'	</div>' +
						'	<div class="bui_media_r">' + closeLabel + '</div>' +
						'</div>';
				} else {
					headerHtml = options.header;
				};
				var footerHtml = '';
				if (!options.footer) {
					options.footerClass = '';
					footerHtml = '';
				} else if (options.footer == 'ask') {
					footerHtml = '<div class="bui_ta_r bui_ts_12  bui_p_12">' +
						'<button class="bui_btn bui_bgc_silver bui_m_8_l" buijs_modal_false>cancel</button>' +
						'<button class="bui_btn bui_bgc_turquoise bui_m_8_l" buijs_modal_true>Done</button>' +
						'</div>';
				} else if (options.footer == 'tips') {
					footerHtml = '<div class="bui_ta_r bui_ts_12 bui_p_12">' +
						'<button class="bui_btn bui_bgc_turquoise bui_m_8_l" buijs_modal_true>I got it!</button>'
					'</div>';
				} else {
					footerHtml = options.footer;
				}

				//添加模态对话框
				if ($("#" + options.setid).length == 0) {
					$('[bui_modal_mask]').after('<div bui_modal id="' + options.setid + '" class="bui_flex_column">' +
						'<div bui_modal_h class="bui_flex_column_t ' + options.headerClass + '">' + headerHtml + '</div>' +
						'<div bui_modal_b class="bui_flex_column_m bui_scrollbar" style="overflow-x:hidden;overflow-y:auto;height:100%;">' +
						options.content + '</div>' +
						'<div bui_modal_f class="bui_flex_column_b ' + options.footerClass + '">' + footerHtml + '</div>' +
						'</div>');
				} else {
					$('#' + options.setid).attr('bui_modal', '').insertAfter('[bui_modal_mask]');
					if ($('#' + options.setid).children('[bui_modal_b]').length == 0) {
						$('#' + options.setid).wrapInner('<div bui_modal_b  style="overflow-x:hidden;overflow-y:auto;"></div>');
					};
					if ($('#' + options.setid).children('[bui_modal_h]').length == 0) {
						$('#' + options.setid).prepend('<div bui_modal_h class="' + options.headerClass + '">' + headerHtml + '</div>');
					};
					if ($('#' + options.setid).children('[bui_modal_f]').length == 0) {
						$('#' + options.setid).append('<div bui_modal_f class="' + options.footerClass + '">' + footerHtml + '</div>')
					};
				};
				$("#" + options.setid).data(options).addClass(options.boxClass).css({
					'position': 'fixed',
					'display': 'block',
					'width': options.width,
					'height': options.height,
					'z-index': zindex,
					'left': '-9999px',
					'top': '-9999px',
					//				'transition': 'all 0.3s'
				});
				//插入内容
				if (options.ajaxload) {
					$("#" + options.setid).attr('bui_modal_url', options.ajaxload).find('[bui_modal_b]').load(options.ajaxload,
						function() {
							SetHtmlCallback();

						});
				} else {
					SetHtmlCallback();
				};

				function SetHtmlCallback() {
					setTimeout(function() {
						$("#" + options.setid).data().height = options.height.indexOf('%') != -1 ? options.height : $("#" + options.setid)
							.height() + 'px';
						_t.resize();
						$("#" + options.setid).removeClass(options.effectOut).addClass(options.effectIn).attr({
							'active': true,
						});
						options.showAfter();
						//ajax
						return false;
					}, 100)
				}

				//关闭操作
				$("[buijs_modal_close]").unbind().bind('click', function() {
					_t.remove($(this).parents('[bui_modal]').attr('id'))
				});

				//选择操作
				$("#" + options.setid + " [buijs_modal_true]").unbind().bind('click', function() {
					_t.remove($(this).parents('[bui_modal]').attr('id'))
					options.trueAfter(options);
				});
				$("#" + options.setid + " [buijs_modal_false]").unbind().bind('click', function() {
					_t.remove($(this).parents('[bui_modal]').attr('id'))
					options.falseAfter(options);
				});

			},
			resize: function() {
				if ($("[bui_modal]").length != -1) {
					$("[bui_modal]").map(function() {
						var _box = $(this),
							_h = _box.children('[bui_modal_h]'),
							_b = _box.children('[bui_modal_b]'),
							_f = _box.children('[bui_modal_f]'),
							setObj = _box.data();
						if (setObj.positions.indexOf('side') != -1) {
							_box.css({
								'width': setObj.positions.indexOf('top') != -1 || setObj.positions.indexOf('bottom') != -1 ? $(window).width() :
									setObj.width,
								'top': setObj.positions.indexOf('top') != -1 || setObj.positions.indexOf('left') != -1 || setObj.positions
									.indexOf('right') != -1 ? 0 : 'auto',
								'bottom': setObj.positions.indexOf('bottom') != -1 || setObj.positions.indexOf('left') != -1 || setObj.positions
									.indexOf('right') != -1 ? 0 : 'auto',
								'left': setObj.positions.indexOf('left') != -1 || setObj.positions.indexOf('top') != -1 || setObj.positions
									.indexOf('bottom') != -1 ? 0 : 'auto',
								'right': setObj.positions.indexOf('right') != -1 || setObj.positions.indexOf('top') != -1 || setObj.positions
									.indexOf('bottom') != -1 ? 0 : 'auto',
							});
							//超出宽度处理
							if (setObj.positions.indexOf('right') != -1 || setObj.positions.indexOf('left') != -1) {
								if (setObj.width.indexOf('%') != -1) {
									_box.width(setObj.width)
								} else {
									_box.width(parseInt(setObj.width) >= $(window).width() ? $(window).width() : setObj.width)
								}
							}
							//超出高度处理
							if (setObj.positions.indexOf('top') != -1 || setObj.positions.indexOf('bottom') != -1) {
								if (setObj.height.indexOf('%') != -1) {
									_box.height(setObj.height)
								} else {
									_box.height(parseInt(setObj.height) >= $(window).height() ? $(window).height() : setObj.height)
								}
							}
						} else {
							//宽度超出window处理
							if (setObj.width.indexOf('%') != -1) {
								_box.width(setObj.width);
							} else {
								parseInt(setObj.width) >= $(window).width() - 32 ? _box.width($(window).width() - 32) : _box.width(setObj.width);
							}
							//高度超出window处理
							if (setObj.height.indexOf('%') != -1) {
								_box.height(setObj.height);
							} else {
								parseInt(setObj.height) >= $(window).height() - 32 ? _box.height($(window).height() - 32) : _box.height(
									setObj.height);
							};

							if (setObj.positions.indexOf('top') != -1) {
								_box.css({
									'top': '1rem',
									'bottom': 'auto'
								});
								//left
								if (setObj.positions.indexOf('left') != -1) {
									_box.css({
										'left': '1rem',
										'right': 'auto'
									})
								}
								//right
								else if (setObj.positions.indexOf('right') != -1) {
									_box.css({
										'right': '1rem',
										'left': 'auto'
									})
								}
								//default
								else {
									_box.css({
										'left': [$(window).width() - _box.width()] / 2,
										'right': 'auto'
									})
								}
							} else if (setObj.positions.indexOf('bottom') != -1) {
								_box.css({
									'bottom': '1rem',
									'top': 'auto'

								});
								//left
								if (setObj.positions.indexOf('left') != -1) {
									_box.css({
										'left': '1rem',
										'right': 'auto'
									})
								}
								//right
								else if (setObj.positions.indexOf('right') != -1) {
									_box.css({
										'right': '1rem',
										'left': 'auto'
									})
								}
								//default
								else {
									_box.css({
										'left': [$(window).width() - _box.width()] / 2,
										'right': 'auto'
									})
								}
							} else {
								_box.css({
									'top': [$(window).height() - _box.height()] / 2 + 'px',
									'bottom': 'auto'
								});
								//left
								if (setObj.positions.indexOf('left') != -1) {
									_box.css({
										'left': '1rem',
										'right': 'auto'
									})
								}
								//right
								else if (setObj.positions.indexOf('right') != -1) {
									_box.css({
										'right': '1rem',
										'left': 'auto'
									})
								}
								//default
								else {
									_box.css({
										'left': [$(window).width() - _box.width()] / 2,
										'right': 'auto'
									})
								}
							};

						};
					});

				}

			},
			//移除modal
			remove: function(id) {
				var closeBox = id ? $('#' + id) : $('[bui_modal]');
				closeBox.map(function() {
					var _t = $(this)
					_t.removeClass(closeBox.data().effectIn).addClass(closeBox.data().effectOut).attr('active', false);

					typeof(closeBox.data().closeAfter) == 'function' ? closeBox.data().closeAfter(): null;

					setTimeout(function() {
						if (closeBox.data().isRemove != false && closeBox.data().isRemove != 'false') {
							_t.remove();
						} else {
							_t.attr('style', 'display: none;');
							_t.removeClass(_t.data().effectOut);
						}
					}, 300)
				});
				if ($("[bui_modal][active=true]").length <= 0) {
					$('[bui_modal_mask]').removeClass('bui_am_fadeIn').addClass('bui_am_fadeOut');
					setTimeout(function() {
						$('[bui_modal_mask]').remove();
					}, 300);
					//停止监听resize
					$(window).unbind('resize');
				}

			}
		}
	},
	appMethods = {
		//随机数
		random: function(min, max, decimal) {
			return decimal ? parseFloat(Math.random() * (max - min) + min).toFixed(decimal) : parseInt(Math.random() * (max -
				min) + min);
		},
		//小数点
		toFixed: function(value, fixed) {
			return value ? value.toFixed(fixed ? fixed : 0) : 0;
		},
		//获取hash
		'hashGet': function() {
			var _t = this;
			var _result = {};
			if (window.location.hash) {
				window.location.hash.split('#').forEach(function(data, index) {
					if (data) {
						_result[data.split('=')[0]] = data.split('=')[1]
					}
				})
				_t.$set(_t, 'hash', _result);
			};
		},
		'urlGet': function() {
			var _t = this;
			var _result = {};
			if (window.location.search) {
				window.location.search.split('?')[1].split('&').forEach(function(data, index) {
					if (data) {
						_result[data.split('=')[0]] = data.split('=')[1]
					}
				})
				_t.$set(_t, 'url', _result);
			};
		},
		//ajax
		'ajax': function(options) {
			var _t = this;
			if (options.url) {
				$.ajax({
					url: options.url,
					type: options.type || 'get',
					xhr: options.xhr,
					async: options.async || true,
					dataType: options.dataType || 'json',
					contentType: options.type == 'post' ? 'application/json;charset=UTF-8' : '',
					data: options.data ? options.type == 'post' ? typeof(options.data) == 'string' ? options.data : JSON.stringify(
						options.data) : options.data : null,
					beforeSend: function(data) {
						typeof(options.beforeSend) == 'function' ? options.beforeSend(data): null;
					},
					complete: function(data) {
						typeof(options.complete) == 'function' ? options.complete(data): null;
					},
					success: function(data) {
						options.vueName ? _t.$set(options.vueName, data) : null;
						typeof(options.success) == 'function' ? options.success(data): null;
					},
					error: function(data) {
						typeof(options.error) == 'function' ? options.error(data): null;
					},
				});
			}
		}, //获取颜色
		'getColor': function(color, num, transparent) {
			!color ? color = 'turquoise' : null;
			!num ? num = 0 : null;
			transparent == 0 ? transparent = 0 : !transparent ? transparent = 1 : null;

			var _result = '',
				_array = [{
						"white": [255, 255, 255, 1]
					},
					{
						"silver": [211, 211, 211, 1]
					},
					{
						"black": [51, 51, 51, 1]
					},
					{
						"coffee": [100, 51, 51, 1]
					},
					{
						"red": [231, 76, 60, 1]
					},
					{
						"pink": [255, 102, 153, 1]
					},
					{
						"orange": [243, 123, 29, 1]
					},
					{
						"yellow": [255, 201, 38, 1]
					},
					{
						"green": [94, 185, 94, 1]
					},
					{
						"turquoise": [26, 188, 156, 1]
					},
					{
						"blue": [52, 152, 219, 1]
					},
					{
						"purple": [141, 108, 255, 1]
					}
				];
			_array.forEach(function(data, index) {
				if (data[color]) {
					_result = 'rgba(' + (data[color][0] + num) + ',' + (data[color][1] + num) + ',' + (data[color][2] + num) + ',' +
						transparent + ')';
				}
			});
			return _result;
		}
	},
	appComponents = {
		//徽章
		'bui-badge': {
			name: 'bui-badge',
			props: {
				'text': {
					'default': "undefined"
				},
				'color': {
					'default': "turquoise"
				},
				'size': {
					'default': 12
				},
				'class': {
					'default': ""
				}
			},
			data: function() {
				var _t = this;
				return {
					classArray: [
						'bui_inline_block',
						'bui_fs_' + _t.size,
						'bui_bgc_' + _t.color,
						'bui_fc_white',
					],
					styleObj: {
						"white-space": "nowrap",
						"font-style": "normal",
						"padding": '0 ' + _t.size / 2 + 'px',
					}
				}
			},
			watch: {
				'color': {
					handler: function(nv, ov) {
						var _t = this;
						_t.$set(_t, 'classArray', [
							'bui_inline_block',
							'bui_fs_' + _t.size,
							'bui_bgc_' + nv,
							'bui_fc_white',
						])
					}
				}
			},
			template: '<i :class="classArray" :style="styleObj" v-text="text"></i>'

		},
		'bui-code': {
			name: 'bui-code',
			props: {
				'language': {
					'default': 'xml'
				}
			},
			mounted: function() {
				var _t = this;
				_t.$el.children[0].classList.add('bui_p_24');
				_t.$el.children[0].innerHTML = _t.$el.children[0].innerHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;');
				hljs.configure({
					languages: [_t.language]
				});
				hljs.highlightBlock(_t.$el.children[0]);
				_t.$el.style = 'display:block'
			},
			template: '' +
				'<div style="display:none;" class="bui_fs_12 bui_bds_4_l">' +
				'	<slot></slot>' +
				'</div>'
		},
		'bui-json': {
			name: 'bui-json',
			props: {
				'data': {
					'default': ''
				}
			},
			mounted: function() {
				var _t = this;
				_t.$el.children[0].classList.add('bui_p_24');
				hljs.configure({
					languages: ['JSON']
				});
				hljs.highlightBlock(_t.$el.children[0]);
				_t.$el.style = 'display:block'
			},
			template: '' +
				'<div style="display:none;" class="bui_fs_12 bui_bds_4_l"><pre v-text="data||\'Undefined\'" style="word-break:break-all;white-space:normal;" class="script"></pre></div>'
		},
		//图片
		'bui-img': {
			name: 'bui-img',
			data: function() {
				return {
					styleObj: {
						'overflow': 'hidden',
						'position': 'relative',
						'background-position': 'center',
						'background-size': 'cover'
					},
					image: ""
				}
			},
			props: {
				'src': null,
				'width': {
					"default": '8rem'
				},
				'ratio': {
					"default": '1:1'
				},
				'class': {
					"default": ''
				},
				'lazy': {
					"default": false
				}
			},
			methods: {
				'init': function() {
					var _t = this;
					setTimeout(function() {
						if (_t.lazy) {
							var chk = self.setInterval(function() {
								if ($(_t.$el).offset().top < $(window).height() && $(_t.$el).offset().top < $(window).width()) {
									self.clearInterval(chk)
									setImg();
								}
							}, 300)
						} else {
							setImg();
						}
					})

					function setImg() {
						var _image = new Image;
						_image.src = _t.src;
						_image.onload = function() {
							_t.$set(_t, 'image', _image.src);
							setTimeout(function() {
								$(_t.$el).children('div').addClass('bui_am_fadeIn');
							}, 100);
						};
					}
				}
			},
			created: function() {
				var _t = this;
				_t.$set(_t.styleObj, 'width', _t.width);
				_t.$set(_t.$options.directives, 'ratio', _t.$root.$options.directives['ratio'])
			},
			watch: {
				'src': {
					handler: function(nv, ov) {
						var _t = this;
						_t.init();
					},
					immediate: true
				}
			},
			template: '' +
				'<div :style="styleObj" v-ratio="ratio" class="bui_bgc_silver_l">' +
				'	<div style="background-size:cover;background-position:center center;width:100%;height:100%;opacity:0;position:absolute" :style="{\'background-image\':\'url(\'+image+\')\'}"></div>' +
				'	<img :src="image" style="position:absolute;opacity:0;width:100%;height:100%;left:0;right:0;border:0;" v-if="image"/>' +
				'</div>'

		},
		//标签
		'bui-tab': {
			props: {
				index: {
					'default': 0
				},
				color: {
					'default': 'turquoise'
				},
				positions: {
					'default': 'top'
				}
			},
			data: function() {
				return {
					nav: [],
					active: null,
					dlClass: [],
					dtClass: [],
					ddClass: [],
					itemClass: []
				}
			},
			mounted: function() {
				var _t = this;
				$.map(_t.$slots, function(data) {
					_t.nav.push({
						name: data[0].data.slot
					})
				});
				setTimeout(function() {
					_t.setActive(_t.nav[_t.index].name);
				});
				//处理方向
				if (_t.positions == 'top') {
					_t.$set(_t, 'dlClass', ['bui_flex_column']);
					_t.$set(_t, 'dtClass', ['bui_flex_column_t', 'bui_bds_1_b']);
					_t.$set(_t, 'ddClass', ['bui_flex_column_m']);
					_t.$set(_t, 'itemClass', ['bui_bds_2_b']);
				} else if (_t.positions == 'bottom') {
					_t.$set(_t, 'dlClass', ['bui_flex_column']);
					_t.$set(_t, 'dtClass', ['bui_flex_column_b', 'bui_bds_1_t']);
					_t.$set(_t, 'ddClass', ['bui_flex_column_m']);
					_t.$set(_t, 'itemClass', ['bui_bds_2_t']);
				} else if (_t.positions == 'left') {
					_t.$set(_t, 'dlClass', ['bui_flex_row']);
					_t.$set(_t, 'dtClass', ['bui_flex_row_l', 'bui_bds_1_r']);
					_t.$set(_t, 'ddClass', ['bui_flex_row_c']);
					_t.$set(_t, 'itemClass', ['bui_bds_2_r']);
				} else if (_t.positions == 'right') {
					_t.$set(_t, 'dlClass', ['bui_flex_row']);
					_t.$set(_t, 'dtClass', ['bui_flex_row_r', 'bui_bds_1_l']);
					_t.$set(_t, 'ddClass', ['bui_flex_row_c']);
					_t.$set(_t, 'itemClass', ['bui_bds_2_l']);
				}

			},
			methods: {
				setActive: function(data) {
					var _t = this;
					_t.$set(_t, 'active', data);
					var box = $(_t.$el).find('dt'),
						active = $(_t.$el).find('[name=' + data + ']'),
						bar = box.find('i');
					box.animate({
						'scrollLeft': active.prev().prev().length != 0 ? active.prev().prev().position().left : 0
					});
				}
			},
			template: '' +
				'<dl :class="dlClass">' +
				'	<dt :class="dtClass" class="bui_bdc_silver_l" style="position:relative;overflow:hidden;">' +
				'		<div class="bui_block" :class="positions==\'top\'||positions==\'bottom\'?\'bui_inline\':null" style="white-space:nowrap;position:relative;">' +
				'			<template v-for="data in nav">' +
				'				<div class="bui_p_12_tb bui_p_24_lr bui_cursor_p"  @click="setActive(data.name)" :class="itemClass.concat([active==data.name?\'bui_strong bui_fc_\'+color+\' bui_bdc_\'+color:\'bui_fc_silver_d bui_fc_\'+color+\'_h bui_bdc_white\'])" :name="data.name">{{data.name}}</div>' +
				'			</template>' +
				'		</div>' +

				'	</dt>' +
				'	<dd :class="ddClass"><slot :name="active"></slot></dd>' +
				'</dl>'
		},
		'bui-progress': {
			name: 'bui-progress',
			props: {
				value: {
					'default': 0
				},
				color: {
					'default': 'turquoise'
				},
				size: {
					'default': 24
				},
				toFixed: {
					'default': 2
				}
			},
			data: function() {
				return {
					spanWidth: 0,
					num: 0
				}
			},
			mounted: function() {
				var _t = this;
			},
			watch: {
				value: {
					handler: function(nv, ov) {
						var _t = this;
						nv < 0 ? _t.$set(_t, 'value', 0) : null
					}
				}
			},
			template: '<div style="overflow:hidden;">' +
				'<div class="bui_progress bui_block" :style="{\'height\':size+\'px\'}">' +
				'		<span :class="[\'bui_bgc_\'+color,\'bui_fc_white\']" :style="{\'width\':value*100+\'%\',\'height\':size+\'px\',\'line-height\':size+\'px\',\'font-size\':size/2.4+\'px\'}"><template v-if="size>=24">{{$root.toFixed(value*100,toFixed)+\'%\'}}</template></span>' +
				'	</div>' +
				'</div>'
		},
		//环形进度条
		'bui-progress-round': {
			name: 'bui-progress-round',
			props: {
				'size': {
					'default': '8rem'
				},
				'value': {
					'default': 0
				},
				'color': {
					'default': 'turquoise'
				}
			},
			data: function() {
				return {
					speed: 0,
					runing: false
				}
			},
			beforeCreate: function() {
				var _t = this;
				_t.$set(_t.$options.directives, 'ratio', _t.$root.$options.directives['ratio']);
			},
			mounted: function() {
				var _t = this;
				_t.$root.resize($(_t.$el), function() {
					_t.setSize(function() {
						_t.setbg();
						_t.setbar(_t.value * 100, _t.value * 100);
					});
				});
			},
			watch: {
				'color': {
					handler: function(nv, ov) {
						var _t = this;
						setTimeout(function() {
							_t.setbg();
							_t.setbar(_t.value * 100, _t.value * 100);
						})
					}
				},
				'value': {
					handler: function(nv, ov) {
						var _t = this;
						if (!_t.runing) {
							if (nv < 0) {
								_t.$emit('update:value', 0);
							};
							setTimeout(function() {
								_t.setbg();
								_t.setbar(ov ? ov * 100 : 0, nv * 100);
							});
						}
					}
				}
			},
			methods: {
				//设置尺寸
				setSize: function(callback) {
					var _t = this;
					$(_t.$el).children('canvas').attr({
						'width': Number($(_t.$el).width() || 48),
						'height': Number($(_t.$el).height() || 48)
					});
					setTimeout(function() {
						typeof(callback) == 'function' ? callback(): null;
					})
				},
				//设置背景
				setbg: function() {
					var _t = this,
						_canvas = $(_t.$el).children('[bgc]');
					var _content = _canvas[0].getContext('2d'),
						center_x = _canvas[0].width / 2,
						center_y = _canvas[0].height / 2;
					_content.clearRect(0, 0, _canvas[0].width, _canvas[0].height);
					_content.save();
					_content.beginPath();
					_content.lineWidth = center_x / 8; //设置线宽
					var radius = center_x - _content.lineWidth;
					_content.lineCap = "round";
					_content.strokeStyle = $(_t.$el).find('bgc').css('background-color');
					_content.arc(center_x, center_y, radius, 0, Math.PI * 2, false);
					_content.stroke();
					_content.closePath();
					_content.restore();
				},
				//设置进度条
				setbar: function(ov, nv) {
					var _t = this,
						_canvas = $(_t.$el).children('[bar]'),
						_content = _canvas[0].getContext('2d'),
						center_x = _canvas[0].width / 2,
						center_y = _canvas[0].height / 2,
						speed = ov;
					_t.$set(_t, 'runing', true);

					var _loop = window.setInterval(function() {
						if (nv > 0) {
							if (nv > ov) {
								if (speed < nv) {
									speed = speed + [nv - ov] / 300 * 12
								} else {
									window.clearInterval(_loop);
									_t.$set(_t, 'runing', false);
								}
							} else if (nv < ov) {
								if (speed > nv) {
									speed = speed - [ov - nv] / 300 * 12
								} else {
									window.clearInterval(_loop);
									_t.$set(_t, 'runing', false);
								}
							} else if (nv == ov) {
								window.clearInterval(_loop);
								_t.$set(_t, 'runing', false);
							}
						} else {
							if (speed > 0) {
								speed = speed + [nv - ov] / 300 * 12
							} else {
								speed = 0
								window.clearInterval(_loop);
								_t.$set(_t, 'runing', false);
							}

						};
						action(speed);
					}, 12)

					function action(speed) {
						speed = speed.toString().split('.')[0];
						_content.clearRect(0, 0, _canvas[0].width, _canvas[0].height);
						_content.strokeStyle = $(_t.$el).find('bar').css('background-color');
						_content.lineWidth = center_x / 8; //设置线宽
						_content.lineCap = "round";
						var radius = center_x - _content.lineWidth;
						_content.save();
						_content.beginPath();
						_content.arc(center_x, center_y, radius, -Math.PI / 2, -Math.PI / 2 + speed * Math.PI * 2 / 100, false);
						_content.stroke();
						_content.closePath();
						_content.restore();

						_content.fillStyle = $(_t.$el).find('bar').css('background-color');
						var font_size = center_x / 2;
						_content.font = font_size + "px msyh";
						var text_width = _content.measureText(speed + "%").width;
						_content.fillText(speed + "%", center_x - text_width / 2, center_y + font_size / 2);
					}

				}
			},
			template: '' +
				'<div :style="{width:size}" v-ratio="\'1:1\'" class="bui_inline_block" style="position:relative;">' +
				'	<canvas bgc></canvas>' +
				'	<canvas bar style="position:absolute;top:0;left:0"></canvas>' +
				'	<bgc style="display:none;" class="bui_bgc_silver_l"></bgc>' +
				'	<bar style="display:none;" :class="\'bui_bgc_\'+color"></bar>' +
				'</div>'
		},
		//表单-输入框
		'bui-form-input': {
			name: 'bui-form-input',
			props: {
				'title': {
					'default': ''
				},
				'resize': {
					'default': 'none'
				},
				'rows': {
					'default': 5
				},
				'type': {
					'default': 'input'
				},
				'value': {
					'default': ''
				},
				'model': {
					'default': ''
				},
				'placeholder': {
					'default': ''
				},
				'size': {
					'default': 32
				},
				'disabled': {
					'default': false
				},
				'readonly': {
					'default': false
				}
			},
			data: function() {
				return {
					'boxStyle': {
						'transition': 'all 0.3s'
					},
					'inputStyle': {
						'width': '100%',
						'display': 'block',
					}
				}
			},
			mounted: function() {
				var _t = this;
				if (_t.value && !_t.model) {
					_t.$set(_t, 'model', _t.value);
					_t.$emit('update:model', _t.value);
				};
				$(_t.$el).find('input,textarea').unbind().bind({
					'focus': function() {
						$(_t.$el).find('.bui_flex_row').css({
							'box-shadow': '0 0 ' + _t.size / 6 + 'px rgba(0,0,0,0.12)'
						})

					},
					'blur': function() {
						$(_t.$el).find('.bui_flex_row').css({
							'box-shadow': '0 0 0 rgba(0,0,0,0)'
						})
					}
				});
			},
			methods: {},
			template: '' +
				'<div class="bui_inline_block">' +
				'	<p class="bui_fc_black_l bui_block" v-html="title" v-if="title" :style="{\'transition\':\'all 0.3s\',\'font-size\':size/16/2.4+\'rem\',\'padding-bottom\':size/16/6+\'rem\'}"></p>' +
				'	<div class="bui_flex_row bui_vm bui_bds_1" :style="{\'transition\':\'all 0.3s\',\'background-color\':disabled?\'rgba(0,0,0,0.06)\':\'rgba(255,255,255,1)\'}">' +
				'		<div class="bui_flex_row_l bui_vm"><slot name="left"></slot></div>' +
				'		<div class="bui_flex_row_r bui_vm"><slot name="right"></slot></div>' +
				'		<div class="bui_flex_row_c bui_vm">' +
				'			<input type="text" :placeholder="placeholder" :value="value"  v-model="model" @input="$emit(\'update:model\',$event.target.value)" :style="{\'transition\':\'all 0.3s\',\'display\':\'block\',\'width\':\'100%\',\'height\':size/16+\'rem\',\'padding\':\'0 \'+size/16/4+\'rem\',\'font-size\':size/16/2.4+\'rem\'}" :disabled="disabled" :readonly="readonly" v-if="type==\'input\'" />' +
				'			<textarea class="bui_scrollbar" :placeholder="placeholder" :value="value"  v-model="model" @input="$emit(\'update:model\',$event.target.value)" :style="{\'transition\':\'all 0.3s\',\'display\':\'block\',\'width\':\'100%\', \'line-height\':size/16*0.64+\'rem\',\'padding\':size/16/4+\'rem\',\'font-size\':size/16/2.4+\'rem\',\'resize\':resize}" :disabled="disabled" :readonly="readonly" :rows="rows" v-if="type==\'textarea\'"></textarea>' +				
				'		</div>' +
				'	</div>' +
				'</div>'
		},
		//select
		'bui-form-select': {
			name: 'bui-form-select',
			props: {
				'title': {
					'default': ''
				},
				'resize': {
					'default': 'none'
				},
				'rows': {
					'default': 5
				},
				'value': {
					'default': ''
				},
				'model': {
					'default': ''
				},
				'placeholder': {
					'default': ''
				},
				'size': {
					'default': 32
				},
				'disabled': {
					'default': false
				},
				'readonly': {
					'default': false
				}
			},
			data: function() {
				return {
					'boxStyle': {
						'transition': 'all 0.3s'
					},
					'inputStyle': {
						'width': '100%',
						'display': 'block',
					}
				}
			},
			mounted: function() {
				var _t = this;
				if (_t.value && !_t.model) {
					_t.$set(_t, 'model', _t.value);
					_t.$emit('update:model', _t.value);
				};
				$(_t.$el).find('select').unbind().bind({
					'focus': function() {
						$(_t.$el).find('.bui_flex_row').css({
							'box-shadow': '0 0 ' + _t.size / 6 + 'px rgba(0,0,0,0.12)'
						})

					},
					'blur': function() {
						$(_t.$el).find('.bui_flex_row').css({
							'box-shadow': '0 0 0 rgba(0,0,0,0)'
						})
					}
				});
			},
			methods: {},
			template: '' +
				'<div class="bui_inline_block">' +
				'	<p class="bui_fc_black_l bui_block" v-html="title" v-if="title" :style="{\'transition\':\'all 0.3s\',\'font-size\':size/16/2.4+\'rem\',\'padding-bottom\':size/16/6+\'rem\'}"></p>' +
				'	<div class="bui_flex_row bui_vm bui_bds_1" :style="{\'transition\':\'all 0.3s\',\'background-color\':disabled?\'rgba(0,0,0,0.06)\':\'rgba(255,255,255,1)\'}">' +
				'		<div class="bui_flex_row_l bui_vm"><slot name="left"></slot></div>' +
				'		<div class="bui_flex_row_r bui_vm"><slot name="right"></slot></div>' +
				'		<div class="bui_flex_row_c bui_vm">' +
				'			<select v-model="model" @input="$emit(\'update:model\',$event.target.value)" :style="{\'transition\':\'all 0.3s\',\'display\':\'block\',\'width\':\'100%\',\'height\':size/16+\'rem\',\'padding\':\'0 \'+size/16/4+\'rem\',\'font-size\':size/16/2.4+\'rem\'}" :disabled="disabled" :readonly="readonly">' +
				'				<slot name="item"></slot>' +
				'			</select>' +
				'		</div>' +
				'	</div>' +
				'</div>'

		},
		//单选
		'bui-form-ratio': {
			name: 'bui-form-radio',
			data: function() {
				return {
					'hover': false,
					'isCheck': false
				}
			},
			props: {
				'name': {
					'default': ''
				},
				'model': null,
				'value': null,
				'color': {
					'default': 'turquoise'
				},
				'bindkey': {
					'default': 'id'
				},
				'disabled': {
					'default': false
				},
				'readonly': {
					'default': false
				},
				'size': {
					'default': 32
				}
			},
			mounted: function() {
				var _t = this;
			},
			methods: {
				'checked': function(value) {
					var _t = this;
					_t.$emit('update:model', value);
				}
			},
			watch: {
				'model': {
					handler: function(nv, ov) {
						var _t = this,
							_value = _t.value || _t.name;
						if (typeof(_value) == 'object' && _t.bindkey) {
							if (_t.model && _value[_t.bindkey] == _t.model[_t.bindkey]) {
								_t.$set(_t, 'isCheck', true)
							} else {
								_t.$set(_t, 'isCheck', false)
							}
						} else {
							if (_value == _t.model) {
								_t.$set(_t, 'isCheck', true)
							} else {
								_t.$set(_t, 'isCheck', false)
							}
						}
					},
					deep: true,
					immediate: true
				}
			},
			template: '' +
				'<div class="bui_inline_block">' +
				'	<div class="bui_flex_row bui_vm bui_block" :style="{\'cursor\': \'pointer\',\'opacity\':disabled?0.6:1}" @click="!disabled&&!readonly?checked(value||name):null" @mouseover="!disabled&&!readonly?hover=true:null" @mouseleave="hover=false">' +
				'		<div class="bui_flex_row_l">' +
				'			<div :style="{\'transition\':\'all 0.3s\',\'width\':size/16+\'rem\',\'height\':size/16+\'rem\',\'transform\':\'scale(0.64)\'}">' +
				'				<i :class="[\'bui_block\',\'bui_round\',\'bui_bdc_\'+(hover||isCheck?color:\'silver\')]" :style="{\'transition\':\'all 0.3s\',\'width\':\'100%\',\'height\':\'100%\',\'border-width\':size/16/8+\'rem\',\'border-style\':\'solid\'}">' +
				'					<div :class="[\'bui_block\',\'bui_round\',\'bui_bgc_\'+color]" :style="{\'transition\':\'all 0.3s\',\'width\':\'100%\',\'height\':\'100%\',\'transform\':isCheck?\'scale(0.64)\':\'scale(0)\'}"></div>' +
				'				</i>' +
				'			</div>' +
				'		</div>' +
				'		<div class="bui_flex_row_c"><p :style="{\'font-size\':size/16/2.4+\'rem\',\'padding-right\':size/16/4+\'rem\'}">{{name}}</p></div>' +
				'	</div>' +
				'</div>'

		},
		//多选
		'bui-form-checkbox': {
			name: 'bui-form-checkbox',
			data: function() {
				return {
					hover: false,
					isCheck: false
				}
			},
			props: {
				'name': {
					'default': ''
				},
				'model': {
					'default': []
				},
				'value': {
					'default': ''
				},
				'color': {
					'default': 'turquoise'
				},
				'disabled': {
					'default': false
				},
				'readonly': {
					'default': false
				},
				'bindkey': null,
				'size': {
					'default': 32
				},
			},
			created: function() {
				var _t = this;

			},
			methods: {
				'check': function() {
					var _t = this;
					var _length = 0,
						_index = -1,
						_value = _t.value || _t.name;
					$.map(_t.model, function(data, index) {
						if (_t.bindkey && typeof(_value) == 'object') {
							if (data[_t.bindkey] == _value[_t.bindkey]) {
								_index = index
								_length++
							}
						} else {
							if (data == _value) {
								_index = index
								_length++
							}
						}

					});
					if (_length == 0) {
						_t.model.push(_value)
					} else {
						_t.model.splice(_index, 1);
					};
					_t.$emit('update:model', _t.model);

				}
			},
			watch: {
				'model': {
					handler: function(nv, ov) {
						var _t = this;
						if (nv && typeof(nv) == 'object') {
							_value = _t.value || _t.name;
							if (typeof(_value) == 'object' && _t.bindkey) {
								var length = 0
								$.map(nv, function(data) {
									if (data[_t.bindkey] == _t.value[_t.bindkey]) {
										length++
									}
								});
								if (length > 0) {
									_t.$set(_t, 'isCheck', true)
								} else {
									_t.$set(_t, 'isCheck', false)
								}
							} else {
								if (nv.indexOf(_value) != -1) {
									_t.$set(_t, 'isCheck', true)
								} else {
									_t.$set(_t, 'isCheck', false)
								}
							}
						}
					},
					deep: true,
					immediate: true
				}
			},
			template: '' +
				'<div class="bui_inline_block" :style="{\'cursor\':\'pointer\',\'opacity\':disabled?0.6:1}" @click="!disabled&&!readonly?check():null" @mouseover="!disabled&&!readonly?hover=true:null" @mouseleave="hover=false">' +
				'	<div class="bui_flex_row bui_vm">' +
				'		<div class="bui_flex_row_l" style="padding-right:{{size/16/4}}rem;">' +
				'			<div :style="{\'transition\':\'all 0.3s\',\'width\':size/16+\'rem\',\'height\':size/16+\'rem\',\'transform\':\'scale(0.64)\'}">' +
				'				<div :class="[\'bui_block\',\'bui_bdc_\'+(hover||isCheck?color:\'silver\'),isCheck?\'bui_bgc_\'+color:\'bui_bgc_white\']" :style="{\'transition\':\'all 0.3s\',\'width\':\'100%\',\'height\':\'100%\',\'border-width\':size/16/8+\'rem\',\'border-style\':\'solid\'}">' +
				'					<div :class="[\'bui_block\',\'bui_fc_white\',\'fa fa-check fa-fw\']" :style="{\'font-size\':size/16/2+\'rem\',\'line-height\':size/16/1.2+\'rem\',\'transition\':\'all 0.3s\',\'width\':\'100%\',\'height\':\'100%\',\'transform\':isCheck?\'scale(1)\':\'scale(0)\'}"></div>' +
				'				</div>' +
				'			</div>' +
				'		</div>' +
				'		<div class="bui_flex_row_c"><p :style="{\'font-size\':size/16/2.4+\'rem\',\'padding-right\':size/16/4+\'rem\'}">{{name}}</p></div>' +
				'	</div>' +
				'</div>'
		},
		//开关
		'bui-form-switch': {
			name: 'bui-form-switch',
			data: function() {
				return {
					isCheck: false
				}
			},
			props: {
				'round': {
					'default': ''
				},
				'shadow': {
					'default': false
				},
				'model': {
					'default': null
				},
				'value-true': {
					'default': true
				},
				'value-false': {
					'default': false
				},
				'size': {
					'default': 32
				},
				'color': {
					'default': 'turquoise'
				},
				'disabled': {
					'default': false
				},
				'readonly': {
					'default': false
				}
			},
			mounted: function() {},
			methods: {
				'checked': function() {
					var _t = this;
					if (_t.model == _t.valueTrue) {
						_t.$emit('update:model', _t.valueFalse)
					} else {
						_t.$emit('update:model', _t.valueTrue)
					}
				}
			},
			watch: {
				'model': {
					handler: function(nv, ov) {
						var _t = this;
						if (nv == _t.valueTrue) {
							_t.$set(_t, 'isCheck', true)
						} else {
							_t.$set(_t, 'isCheck', false)
						}
					},
					deep: true,
					immediate: true
				}
			},
			template: '' +
				'<div :class="[\'bui_inline_block\']" :style="{\'width\':size/16*2+\'rem\',\'height\':size/16+\'rem\',\'cursor\': \'pointer\',\'transition\':\'all 0.3s\',\'position\':\'relative\',\'box-shadow\':shadow?\'inset 0 0 \'+size/16/4+\'rem rgba(0,0,0,0.48)\':\'none\',\'opacity\':disabled?0.6:1,\'overflow\':\'hidden\',\'border-radius\':round==\'radius\'?size/16/4+\'rem\':round==\'round\'?size/16+\'rem\':0,\'background-color\':isCheck?$root.getColor(color):$root.getColor(\'silver\')}" @click="!disabled&&!readonly?checked():null">' +
				'	<div :style="{\'width\':size/16+\'rem\',\'height\':size/16+\'rem\',\'padding\':size/16/8+\'rem\',\'transition\':\'all 0.3s\',\'position\': \'absolute\',left:isCheck?\'50%\':0,\'box-shadow\':shadow?\'0 0 \'+size/16/4+\'rem rgba(0,0,0,0.48)\':\'none\',\'border-radius\':round==\'radius\'?size/16/4+\'rem\':round==\'round\'?size/16+\'rem\':0,\'background-color\':\'#ffffff\',\'transform\':\'scale(0.72)\'}">' +
				'	</div>' +
				'</div>'
		},
		'bui-btn': {
			name: 'bui-btn',
			props: {
				type: {
					default: 'button'
				},
				block: {
					default: false
				},
				width: {
					default: 'auto'
				},
				size: {
					default: 32,
				},
				color: {
					default: 'white'
				},
				bright: {
					default: 'light'
				},
				disabled: {
					default: false
				},
				href: {
					default: 'javascript:;'
				},
				target: {
					default: null
				},
				round: {
					default: 'radius'
				},
				sq: {
					default: false
				}
			},
			created() {
				var _t = this;
			},
			methods: {
				click() {
					var _t = this;
					if (_t.type == 'button') {
						if (typeof(_t.$listeners.click) == 'function') {
							_t.$listeners.click();
						}
					}
				}
			},
			template: '' +
				'<div :class="[block?\'bui_block bui_ta_c\':\'bui_inline_block\']" :style="{\'width\':sq?size+\'px\':width,\'width\':sq?size+\'px\':width,}">' +
				'	<template v-if="type==\'button\'||type==\'submit\'">' +
				'		<button @click="click" :type="type" :class="[\'bui_ta_c\',\'bui_btn\',\'bui_vm\',\'bui_bgc_\'+color,bright==\'light\'?\'bui_btn_light\':\'\',\'bui_block\']" :style="{\'height\':size+\'px\',\'line-height\':size-2+\'px\',\'padding\':\'0 \'+(sq?0:size/16*12)+\'px\',\'font-size\':size/16*6+\'px\',\'transition\':\'all 0.3s\',\'border-radius\':round==\'round\'?size/16*8+\'px\':round==\'radius\'?size/16*3+\'px\':0}" :disabled="disabled">' +
				'			<slot></slot>' +
				'		</button>' +
				'	</template>' +
				'	<template v-if="type==\'link\'">' +
				'		<a :href="!disabled?href:\'javascript:;\'" :target="target" :class="[\'bui_ta_c\',\'bui_btn\',\'bui_vm\',\'bui_bgc_\'+color,bright==\'light\'?\'bui_btn_light\':\'\',\'bui_block\']" :style="{\'height\':size+\'px\',\'line-height\':size-2+\'px\',\'padding\':\'0 \'+(sq?0:size/16*12)+\'px\',\'font-size\':size/16*6+\'px\',\'transition\':\'all 0.3s\',\'border-radius\':round==\'round\'?size/16*8+\'px\':round==\'radius\'?size/16*3+\'px\':0}" :disabled="disabled">' +
				'			<slot></slot>' +
				'		</a>' +
				'	</template>' +
				'</div>'
		},
		//按钮组
		'bui-form-btngroup': {
			name: 'bui-form-btngroup',
			props: {
				'model': {
					'default': ''
				},
				'round': {
					'default': 'radius'
				},
				'size': {
					'default': 32
				},
				'color': {
					'default': 'turquoise'
				},
				'items': {
					'default': []
				}
			},
			mounted: function() {
				var _t = this;
				setTimeout(function() {
					var nitems = [],
						oitems = [];
					var _listenItems = setInterval(function() {
						nitems = _t.$slots.item;
						if (nitems.length == oitems.length) {} else {
							_t.$set(_t, 'items', []);
							_t.$slots.item.forEach(function(data, index) {
								_t.items.push({
									text: data.data.attrs['text'],
									color: data.data.attrs['color'],
									href: data.data.attrs['href'],
									iconl: data.data.attrs['iconl'],
									iconr: data.data.attrs['iconr'],
									val: data.data.attrs['val']
								})
							});
							oitems = nitems;
						};
					})
				})

			},
			methods: {
				'checked': function(item) {
					var _t = this;
					if (item.href) {
						window.location.href = item.href
					}
					_t.$emit('update:model', item.val);
				}
			},
			template: '' +
				'<div class="bui_inline_block bui_bds_1" :style="{\'transition\':\'all 0.3s\',\'overflow\':\'hidden\',\'background-color\':$root.getColor(color),\'border-color\':$root.getColor(color)+\' !important\',\'border-radius\':round==\'radius\'?size/16/4+\'rem\':round==\'round\'?size/16+\'rem\':0}">' +
				'	<div>' +
				'	<template v-for="(item,index) in items">' +
				'		<div :class="[\'bui_fl\',index!=0?\'bui_bds_1_l bui_bdc_\'+color:\'\']">' +
				'			<div @click="!checked(item)" class="bui_block bui_vm bui_ta_c bui_cursor_p" :style="{\'transition\':\'all 0.3s\',\'height\':size/16+\'rem !important\',\'line-height\':size/16+\'rem !important\',\'padding\':\'0 \'+size/16/2+\'rem !important\',\'font-size\':+size/16/2.4+\'rem !important\',\'color\':item.val==model?$root.getColor(\'white\'):$root.getColor(item.color||color),\'background-color\':item.val==model?$root.getColor(item.color||color):$root.getColor(\'white\')}"><i v-if="item.iconl" :class="[item.iconl,\'bui_vm\']"></i><span v-if="item.text">{{item.text}}</span><i v-if="item.iconr" :class="[item.iconr,\'bui_vm\']"></i></div>' +
				'		</div>' +
				'	</template>' +
				'	</div>' +
				'</div>'
		}
	},
	buiVue = {
		data: function() {
			return appData
		},
		mounted: function() {
			var _t = this;
			//监听hash,url参数;
			_t.hashGet();
			_t.urlGet();
			window.addEventListener('hashchange', function() {
				_t.hashGet();
			});
		},
		methods: appMethods,
		//组件
		components: appComponents,
		//自定义指令
		directives: {
			'ratio': function(el, data) {
				app.resize($(el), function() {
					resize();
				});

				function resize() {
					$(el).css({
						'height': $(el).width() * data.value.split(':')[1] / data.value.split(':')[0] + "px"
					})
				}
			}
		}
	};

function initVue(dom) {
	$.extend(buiVue);
	app = new Vue(buiVue);
	app.$mount(dom);
	setTimeout(function() {
		$(dom).css({
			'display': 'block'
		});
	});
	console.log(app)
};
