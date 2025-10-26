
import datetime
import logging
from mkdocs.config.defaults import MkDocsConfig

# Set up logging
LOG = logging.getLogger(__name__)

def on_config(config: MkDocsConfig) -> MkDocsConfig | None:

    # Set current year in copyright
    year: str = str(datetime.datetime.now().year)
    config.copyright = config.copyright.format(year=year)

    # Parse and set in config the lab_id and lab_title from site_name. These variables are used in home.html template override
    site_name_parts = config.site_name.split(":", 1)
    if len(site_name_parts) == 2:
        lab_id = site_name_parts[0].strip()
        lab_title = site_name_parts[1].strip()
        config.lab_id = lab_id
        config.lab_title = lab_title
    # Fallback if no colon found - set lab_id to empty and lab_title to site_name
    else:
        config.lab_id = ""
        config.lab_title = config.site_name
    
    # Ensure site_description matches site_name if not explicitly set - this field is used in meta tags
    if not config.site_description or config.site_description == config.site_name:
        config.site_description = config.site_name
    
    LOG.info("Config tweaks initialized")
    