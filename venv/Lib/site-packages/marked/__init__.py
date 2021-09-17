import re
import markgen
from bs4 import BeautifulSoup

try:
    string_type = unicode
except:
    string_type = str

# Tag name to markgen function mappings
TAGS = {
    'p': markgen.paragraph,
    'div': markgen.paragraph,
    'a': markgen.link,
    'strong': markgen.emphasis,
    'em': markgen.emphasis,
    'b': markgen.emphasis,
    'i': markgen.emphasis,
    'u': markgen.emphasis,
    'img': markgen.image,
    'image': markgen.image,
    'blockquote': markgen.quote,
    'pre': markgen.pre,
    'code': markgen.pre,
    'h1': markgen.header,
    'h2': markgen.header,
    'h3': markgen.header,
    'h4': markgen.header,
    'h5': markgen.header,
    'h6': markgen.header,
    'ul': markgen.ulist,
    'ol': markgen.olist
}

# Default markgen function kwargs for some mapped tags
DEFAULT_ARGS = {
    'code': {
        'inline': True
    },
    'h2': {
        'depth': 2
    },
    'h3': {
        'depth': 3
    },
    'h4': {
        'depth': 4
    },
    'h5': {
        'depth': 5
    },
    'h6': {
        'depth': 6
    }
}

# Map tag attributes to markgen function kwargs
ATTRS = {
    'a': {
        'href': 'address',
        'title': 'title'
    },
    'img': {
        'src': 'address',
        'title': 'title'
    },
    'image': {
        'src': 'address',
        'title': 'title'
    }
}

# Which tags should pass <li> elements as a []
LISTS = [
    'ul',
    'ol'
]

# We need to wrap these for "special" handling of whitespace
WRAP_TAGS = [
    'code',
    'pre'
]

REPLACE_NEWLINE_RE = r'[\n|\r\n|\r]{3,}'


def markup_to_markdown(content):
    """
    """

    soup = BeautifulSoup(content)

    # Account for HTML snippets and full documents alike
    contents = soup.body.contents if soup.body is not None else soup.contents

    # Return markdown with normalised whitespace
    output = re.sub(REPLACE_NEWLINE_RE, u'\n\n', _iterate_over_contents(contents),
                    re.UNICODE).strip()
    return output


def _iterate_over_contents(contents):
    """
    """

    out = u''

    for c in contents:
        _string = u''
        if hasattr(c, 'contents'):
            # Thar be mowr children ahoy cap'n, let's parse 'em!
            _string = _iterate_over_contents(c.contents)
        else:
            _string = string_type(c)

        # Apply any tag -> callable mappings
        if c.name in TAGS:
            kwargs = DEFAULT_ARGS.get(c.name, {}).copy()
            # Apply any tag attribute -> keyword arguments to the mapping
            # if required
            if c.name in ATTRS:
                for attr, attr_map in ATTRS[c.name].iteritems():
                    if attr in c.attrs:
                        kwargs[attr_map] = c.attrs[attr]

            if c.name in LISTS:
                # Lists are special, as they need an iterable of the <li> values
                value = c.find_all('li')
            else:
                value = _string

            _string = TAGS[c.name](value.strip(), **kwargs)

        out += u"\n{0}".format(_string)

    return out
