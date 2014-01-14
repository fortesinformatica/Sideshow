#!/bin/bash
#Bash script to combine, resolve requires, lint and minify the javascript files of a project
#author: Alcides Queiroz [alcidesqueiroz(at)gmail(dot)com]
#date: 2013-11-24
#version: 0.0.3

library_name="sideshow"

#gets the manifest with the order of files 
#to combine (separated by line breaks) and puts all in one line
files=$(gawk -vRS="" -vOFS=' ' '$1=$1' ../src/.BUILD)
version=$(cat ../VERSION)
output_debug_file=${library_name}-${version}.debug.js
output_minified_file=${library_name}-${version}.min.js
original_folder=$(pwd)
mkdir -p ../tmp

[ "$1" == "dev" ] && mode="dev" || mode="prod" 

remove_previous_output_files(){
	if [ "$mode" == "dev" ] ; then
		rm ../${library_name}-*.debug.js > /dev/null
	else
		rm ../${library_name}-*.js > /dev/null
	fi
	rm ../tmp/* > /dev/null
}

resolve_dependencies(){
	tmp_file_path="../tmp/${output_debug_file}.tmp"
	tmp_file_content=`cat ${tmp_file_path}`
	resolved_file=""

	while IFS='' read -r line; do
		require_pattern="//= require "
		if [[ $line == *$require_pattern* ]]
		then
			trailed_line="$(echo $line | sed 's/^ *//g')"
			req=${trailed_line#//= require }
			required_file_content=`cat ${req}.js`

			printf "%s\n" "$required_file_content"
		else
			printf "%s\n" "$line"
		fi
	done <<< "$tmp_file_content" > $tmp_file_path
}

combine_files(){
	#combine the files for build inserting a new line before each (except for the first line)
	gawk 'FNR==1 && NR!=1{print ""}1' ${files} > ../tmp/${output_debug_file}.tmp
}

beautify_and_generate_debug_file(){
	js-beautify --file ../tmp/${output_debug_file}.tmp --outfile ../distr/${output_debug_file} --indent-size 4 --indent-char " " --preserve-newlines 
}

minify_files(){
	uglifyjs ../distr/${output_debug_file} --output ../distr/${output_minified_file} --compressor --coments
}

clear
if [ "$mode" == "dev" ]; then
	echo "***Development Mode (just combining files)***"
fi

echo "Starting build process..."
remove_previous_output_files

cd ../src

echo "Combining and generating temporary .js file..."
combine_files

echo "Resolving dependencies..."
resolve_dependencies

echo "Beautifying and generating .debug file..."
beautify_and_generate_debug_file

if [ "$mode" != "dev" ]; then
	
	echo "Generating .min output file (with UglifyJS)..."
	cd ${original_folder}
	minify_files
	
	cd ..
	echo "Generating Docs (with YUIDoc)..."
	yuidoc ./src
	
	cd ${original_folder}
fi
