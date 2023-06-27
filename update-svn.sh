#!/bin/bash

set -euo pipefail
set -x

script_name="$(basename $0)"

print_usage() {
  echo "${script_name} <source git directory> <target svn directory>"
}

if (( $# < 2 ));
then
  print_usage
  exit 1
fi

source_dir=$1; shift
target_dir=$1; shift

target_trunk="${target_dir}/trunk"
target_assets="${target_dir}/assets"

if [[ -d "${target_trunk}" ]];
then
  rm -IR "${target_trunk}"
fi

find "${source_dir}" \
  -type d \( -name "node_modules" -o -name "assets" -o -name ".git" -o -name ".github" \) -prune \
  -o -type f \( -name ".gitignore" -o -name "${script_name}" \) -prune \
  -o -type f -print0 |
while IFS= read -r -d '' file; do
    rel_path="${file#$source_dir}"
    target_subdir="${target_trunk}${rel_path%/*}"

    mkdir -p "${target_subdir}"
    cp "${file}" "${target_subdir}"
done


if [[ -d "${target_assets}" ]];
then
  rm -IR "${target_assets}"
fi

cp -R "${source_dir}/assets" "${target_assets}"
