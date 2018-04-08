'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _parseRss = require('parse-rss');

var _parseRss2 = _interopRequireDefault(_parseRss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * reddit-rss-scrape - Reddit RSS Scraper <https://github.com/msikma/reddit-rss-scrape>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Copyright © 2018, Michiel Sikma
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */

// Returns the URL of a sub's RSS feed.
var urlSubRSS = function urlSubRSS(sub) {
  return 'https://www.reddit.com/r/' + sub + '/.rss';
};

var findTopics = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(sub, id) {
    var items;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return rssParse(urlSubRSS(sub));

          case 2:
            items = _context.sent;

            if (!(items.length === 0)) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('return', []);

          case 5:
            return _context.abrupt('return', items.map(function (entry) {
              return _extends({}, entry, { id: entry.guid, descriptionText: removeHTML(entry.description, 350) });
            }));

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function findTopics(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Strip HTML from a Reddit RSS description.
 */
var removeHTML = function removeHTML(str) {
  var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 350;

  var $ = _cheerio2.default.load(str);
  var text = $('.md').text().trim();
  if (limit && text.length > limit) {
    return text.slice(0, limit) + ' [...]';
  }
  return text;
};

/**
 * Returns a promise which, upon resolution, contains the contents of the RSS found at the given URL.
 */
var rssParse = function rssParse(url) {
  return new Promise(function (resolve, reject) {
    (0, _parseRss2.default)(url, function (err, rss) {
      if (err) return reject(err, rss);
      if (rss) return resolve(rss);
    });
  });
};

exports.default = findTopics;