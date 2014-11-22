/* Created by FrankFang on 14-7-24. */
/* jshint -W040:true */
'use strict';

var fs = require('fs')
var path = require('path')
var through2 = require('through2')
var gUtil = require('gulp-util')
var PluginError = gUtil.PluginError

module.exports = function (options) {

    options = options || {}

    return through2.obj(function (file, enc, cb) {

        if (file.isNull()) {
            return cb(null, file)
        }

        if (file.isStream()) {
            return cb(new PluginError('gulp-html-extend', 'Streaming is not supported'))
        }

        if (file.isBuffer()) {

            extendFile(file, function (noMaster) {
                return cb(null, file)
            })
        }


    })

}

function makeFile(absolutePath, cb) {
    fs.readFile(absolutePath, function (error, data) {
        if (error) { throw error }
        var file = new gUtil.File({
            base: path.dirname(absolutePath),
            path: absolutePath,
            contents: new Buffer(data),
        })
        cb(file)
    })
}

function extendFile(file, afterExtend) {

    var fileContent = file.contents.toString()
    var fileLines = splitByLine(fileContent)

    var includedLines = fileLines.map(function (line) {
        var includeRelativePath = findInclude(line)
        if (includeRelativePath) {
            var includeAbsolutePath = path.join(path.dirname(file.path), includeRelativePath)
            return fs.readFileSync(includeAbsolutePath);
        } else {
            return line
        }
    })

    file.contents = new Buffer(includedLines.join('\n'))


    var masterRelativePath = findMaster(file.contents.toString('utf-8'))
    if (!masterRelativePath) {
        afterExtend()
        return
    }

    var masterAbsolute = path.join(path.dirname(file.path), masterRelativePath)

    makeFile(masterAbsolute, function (masterFile) {

        extendFile(masterFile, function () {

            var masterContent = masterFile.contents.toString()
            var lines = masterContent.split(/\n|\r|\r\n/)

            var newLines = lines.map(function (line, index, array) {
                var blockName = findPlaceholder(line)
                if (blockName) {
                    var blockContent = getBlockContent(file.contents.toString(), blockName)
                    return blockContent || line
                } else {
                    return line
                }
            })

            var newContent = newLines.join('\n')

            file.contents = new Buffer(newContent)

            return afterExtend()

        })

    })

}

function findMaster(string) {
    var regex = /<!--\s*@@master\s*=\s*(\S+)\s*-->/
    var match = string.match(regex)
    return match ? match[1] : null

}

function findInclude(string) {
    var regex = /<!--\s*@@include\s*=\s*(\S+)\s*-->/
    var match = string.match(regex)
    return match ? match[1] : null

}

function findPlaceholder(string) {
    var regex = /<!--\s*@@placeholder\s*=\s*(\S+)\s*-->/
    var match = string.match(regex)
    return match ? match[1] : null
}

function getBlockContent(string, blockName) {
    var result = ''
    var lines = splitByLine(string)
    var inBlock = false
    var regex = new RegExp('<!--\\s*@@block\\s*=\\s*' + blockName + '\\s*-->')

    return lines.reduce(function (prev, current) {
            if (inBlock) {
                var matchEnd = /<!--\s*@@close\s*-->/.test(current)
                if (matchEnd) {
                    inBlock = false
                    return prev
                }
                return prev + (prev === '' ? '' : '\n') + current
            }
            var matchBegin = regex.test(current)
            if (matchBegin) {
                inBlock = true
                return prev
            } else {
                return prev
            }
        }, '');
}

function splitByLine(string) {
    return string.split(/\n|\r|\r\n/)
}
