#!/bin/bash
# 遇到不存在的变量就会报错，并停止执行
set -u
# 用来在运行结果之前，先输出执行的那一行命令
# set -x
# 脚本只要发生错误，就终止执行
set -e
# 只要一个子命令失败，整个管道命令就失败，脚本就会终止执行。
set -o pipefail

SOURCES=(src/*)

declare -a JSON_LIST

length=${#SOURCES[@]}
for ((i = 0; i < $length; i++)); do
    # echo "${SOURCES[$i]}"
    JSON_LIST[$i]=$(cat "${SOURCES[$i]}")
done

# echo ${JSON_LIST[1]}
# echo ${#JSON_LIST[@]}

# 将数组按逗号关联
json_data=$(printf '%s\n' "$(
    IFS=,
    printf '%s' "${JSON_LIST[*]}"
)")
booksources="[$json_data]"
echo $booksources >docs/data.json
