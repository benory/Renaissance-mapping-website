---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
---

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}

<input type="text" id="input" onkeyup="UserSearch()" placeholder="Enter person, place, or event"><span id="search-count"></span>

<div id="map"></div>