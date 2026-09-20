.PHONY: tag dist
tag:
	@if [ "$(TAG)" != "" ]; then \
		git tag -f $(TAG); \
		git push -f github $(TAG); \
	fi

# DEV_THEME_DIR = /Users/dayu/Coder/everkm/daobox-site-themes/theme-youlog/__everkm/theme/youlog
DEV_THEME_DIR = /Users/dayu/Coder/everkm/daobox-site-themes/theme-paper/__everkm/theme/paper
THEME ?= paper

ifneq (, $(shell echo $$DEBUG))
  EKMP = "/Users/dayu/Coder/everkm/everkm2/be/everkm-publish/target/debug/everkm-publish"
else
  EKMP = ./node_modules/.bin/everkm-publish
endif

print-ekmp:
	@echo $(EKMP)
	@$(EKMP) --version

work-dev: print-ekmp
	@EVERKM_LOG=everkm_publish=debug,info \
		$(EKMP) \
		serve \
		--work-dir ../ \
		--theme-dev \
		--theme-dir $(DEV_THEME_DIR) \
		--theme $(THEME) \
		--lazy-img \
		--auto-fix-on-update

work: print-ekmp
	@EVERKM_LOG=everkm_publish=debug,info \
		$(EKMP) \
		serve \
		--work-dir ../ \
		--theme $(THEME) \
		--lazy-img \
		--auto-fix-on-update

preview:
	$(EKMP) web dist
 
push: print-ekmp
	$(EKMP) algolia ../ reset
	$(EKMP) algolia ../ walk
push-retry: print-ekmp
	$(EKMP) algolia ../ push-failed

dist: print-ekmp
	rm -rf dist
	$(EKMP) serve \
		--work-dir ../ \
		--theme $(THEME) \
		--lazy-img \
		--export \
		--with-vercel
	python3 scripts/patch_vercel_redirects.py dist/vercel.json

dist-dev: print-ekmp
	rm -rf dist
	$(EKMP) \
		serve \
		--work-dir ../ \
		--theme-dev \
		--theme-dir $(DEV_THEME_DIR) \
		--theme $(THEME) \
		--lazy-img \
		--export \
		--with-vercel
	python3 scripts/patch_vercel_redirects.py dist/vercel.json

lint: print-ekmp
	@EVERKM_LOG=everkm_publish=debug,info \
		$(EKMP) lint ../ --auto-fix

install-youlog:
	@if [ -z "$(VERSION)" ]; then \
		everkm-publish theme install youlog --force --work-dir ../; \
	else \
		everkm-publish theme install youlog@$(VERSION) --force --work-dir ../; \
	fi

install-theme-paper:
	everkm-publish theme install paper --force --work-dir ../
	
install-everkm-publish:
	pnpm install everkm-publish@latest