(function ($) {
	$.fn.qrcode = function (options) {
		// if options is string,
		if (typeof options === 'string') {
			options = {text: options};
		}

		// set default values
		// typeNumber < 1 for automatic calculation
		options = $.extend({}, {
			render: "canvas",
			width: 256,
			height: 256,
			typeNumber: -1,
			correctLevel: QRErrorCorrectLevel.H,
			background: "#ffffff",
			foreground: "#000000"
		}, options);

		var createCanvas = function () {
			// create the qrcode itself
			var qrcode = new QRCode(options.typeNumber, options.correctLevel);
			qrcode.addData(options.text);
			qrcode.make();

			// create canvas element
			var canvas = document.createElement('canvas');
            canvas.style.width =  options.width  + "px";
            canvas.style.height =  options.width  + "px";
            // to support retina screen.
            var scaleRate = window.devicePixelRatio || 1;
			canvas.width = options.width * scaleRate;
			canvas.height = options.height * scaleRate;
			var ctx = canvas.getContext('2d');

			// compute tileW/tileH based on options.width/options.height
			var tileW = options.width *  scaleRate / qrcode.getModuleCount();
			var tileH = options.height *  scaleRate / qrcode.getModuleCount();

			// draw in the canvas
			for (var row = 0; row < qrcode.getModuleCount(); row++) {
				for (var col = 0; col < qrcode.getModuleCount(); col++) {
					ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
					var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
					var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
					ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
				}
			}
			// return just built canvas
			return canvas;
		};

		// from Jon-Carlos Rivera (https://github.com/imbcmdth)
		var createTable = function () {
			// create the qrcode itself
			var qrcode = new QRCode(options.typeNumber, options.correctLevel);
			qrcode.addData(options.text);
			qrcode.make();

			// create table element
			var $table = $('<table></table>')
				// remvoe tables width and height, to fix scale bug when use very small size.
				// maybe table size is smaller then option specified, but it work correct at least.
				//.css("width", options.width + "px")
				//.css("height", options.height + "px")
				.css("border", "0px")
				.css("border-collapse", "collapse")
				.css('background-color', options.background);

			// compute tileS percentage
            var scaleRate = window.devicePixelRatio || 1;
			var tileW = Math.floor(options.width * scaleRate / qrcode.getModuleCount())/scaleRate;
			var tileH = Math.floor(options.height * scaleRate/ qrcode.getModuleCount())/scaleRate;
			if (tileH <= 0) tileH = 1;
			if (tileW <= 0) tileW = 1;

			// draw in the table
			for (var row = 0; row < qrcode.getModuleCount(); row++) {
				var $row = $('<tr></tr>').css('height', tileH + "px").appendTo($table);

				for (var col = 0; col < qrcode.getModuleCount(); col++) {
					$('<td></td>')
						.css('width', tileW + "px")
						.css('height', tileH + "px")
						.css('marggin', "0 0 0 0")
						.css('padding', "0 0 0 0")
						.css('background-color', qrcode.isDark(row, col) ? options.foreground : options.background)
						.appendTo($row);
				}
			}
			// return just built canvas
			return $table;
		};


		return this.each(function () {
			var element = options.render == "canvas" ? createCanvas() : createTable();
			$(element).appendTo(this);
		});
	};
})(jQuery);
