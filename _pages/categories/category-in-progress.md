---
title: "In Progress"
layout: archive
permalink: categories/in-progress
author_profile: true
sidebar_main: true
---


{% assign posts = site.categories['In Progress'] %}
{% for post in posts %} {% include archive-single.html type=page.entries_layout %} {% endfor %}