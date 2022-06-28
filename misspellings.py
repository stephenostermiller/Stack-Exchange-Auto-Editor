#!/usr/bin/python3
import sys
import re

words = {}
for line in re.split(r'[\|\n]',sys.stdin.read()):
	if (line):
		(wrong, correct) = re.split(r':', line)
		correct = correct.strip()
		if (correct):
			if (correct not in words):
				words[correct] = {}
			for word in re.split(r',', wrong):
				word = word.strip()
				if (word and word != correct):
					words[correct][word] = 1

line = ''
for ms in sorted(words.items()):
	ms = ",".join(sorted(ms[1]))+ ":" + ms[0]
	if (len(line) > 1200):
		print(line+'"+')
		line = '\t\t"'
	if not line:
		line = '\t\t"'
	else:
		line += '|'
	line+=ms
print(line)
