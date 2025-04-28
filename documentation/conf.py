# Configuration Sphinx pour sphinx_book_theme

# -- Project information -----------------------------------------------------
project = 'Rocket Simulator'
author = 'Pierre-Ange Delbary Rouillé'
release = '1.0'

# -- Extensions ---------------------------------------------------------------
extensions = [
    'myst_parser',  # Pour supporter Markdown
    'sphinx.ext.autodoc',
    'sphinx.ext.viewcode',
    'sphinx_multitoc_numbering',
    'sphinx_togglebutton',
    'sphinx_external_toc'
]

external_toc_path = "_toc.yml"  # optional, default: _toc.yml
external_toc_exclude_missing = True  # optional, default: False

# -- Source formats -----------------------------------------------------------
source_suffix = {
    '.rst': 'restructuredtext',
    '.md': 'markdown',
}

# -- HTML Theme ---------------------------------------------------------------
html_theme = 'sphinx_book_theme'

html_theme_options = {
    "repository_url": "https://github.com/PierreAngeDR/RocketBuilder",  # (optionnel) lien GitHub en haut
    "use_repository_button": True,
    "use_issues_button": True,
    "use_edit_page_button": False,
    "path_to_docs": "docs/",  # chemin vers les docs dans le repo
    "home_page_in_toc": True,  # lien vers la page d'accueil dans la ToC
    "show_navbar_depth": 3,  # Profondeur du menu navbar (2 = sections + sous-sections)
    "launch_buttons": {  # (optionnel) désactiver lancement Binder/Colab
        "binderhub_url": "",
        "colab_url": "",
    },
    "theme_switcher": {
        "json_url": "",
        "version_match": "stable",
    },
    "use_fullscreen_button": True,  # bouton "fullscreen" dans la navigation
}

# -- Options pour les chemins -------------------------------------------------
templates_path = ['_templates']
html_static_path = ['_static']


exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

# -- MyST Parser configuration ------------------------------------------------
myst_enable_extensions = [
    "deflist",         # Listes définition
    "colon_fence",     # ::: blocks
    "linkify",         # auto lien https://
    "substitution",    # variables
]

myst_title_to_header = True

# -- Extra HTML options -------------------------------------------------------
html_title = "Documentation du projet RocketBuilder"
html_logo = "_static/favicon.png"  
html_favicon = "_static/favicon.ico"  
