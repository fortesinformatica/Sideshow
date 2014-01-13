#!/bin/bash
#Bash script to combine, resolve requires, lint and minify the javascript files of a project
#author: Alcides Queiroz [alcidesqueiroz(at)gmail(dot)com]
#date: 2013-11-24
#version: 0.0.2

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
	requires_found=$(cat ${tmp_file_path} | grep "//= require")
	requires=()
	unique_requires=()
	
	while read -r line; do
		req=("$line")
		#remove the //=require directive and leaves only the required file name
		req=${req#//= require }
		requires+=($req)
	done <<< "$requires_found"

	#getting unique requires 
	unique_requires=($(printf "%s\n" "${requires[@]}" | sort -u))
	
	tmp_file_content=`cat ${tmp_file_path}`
	for req in "${unique_requires[@]}"
	do
		#gets the required file content
		required_file_content=`cat ${req}.js`
		#reproduces the original require directive
		require_directive="//= require ${req}"
		#replaces each require directive with the required file content
		tmp_file_content=${tmp_file_content//$require_directive/$required_file_content}
	done

	#saves the file content to the temp file
	echo "${tmp_file_content}" > $tmp_file_path
}

combine_files(){
	#combine the files for build inserting a new line before each (except for the first line)
	gawk 'FNR==1 && NR!=1{print ""}1' ${files} > ../tmp/${output_debug_file}.tmp
	#mincer --include ../src --output ../tmp teste.js
}

beautify_and_generate_debug_file(){
	js-beautify --file ../tmp/${output_debug_file}.tmp --outfile ../${output_debug_file} --indent-size 4 --indent-char " " --preserve-newlines 
}

minify_files(){
	uglifyjs ../${output_debug_file} --output ../${output_minified_file} --compressor --coments
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
	echo "Generating Docs... (with YUIDoc)"
	yuidoc ./src
	
	cd ${original_folder}
fi
