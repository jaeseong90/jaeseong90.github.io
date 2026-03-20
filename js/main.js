// Mobile Menu Toggle
function toggleMenu() {
  const nav = document.getElementById('nav');
  nav.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
  const nav = document.getElementById('nav');
  const menuToggle = document.querySelector('.menu-toggle');

  if (nav && menuToggle) {
    if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
      nav.classList.remove('active');
    }
  }
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img');
  images.forEach(function(img) {
    img.addEventListener('load', function() {
      this.classList.add('loaded');
    });
  });
});

// Console message
console.log('%c재성의 개발 블로그에 오신 것을 환영합니다!',
  'color: #22d3ee; font-size: 16px; font-weight: bold;');

// ============================================================
// Interactive UX Enhancements
// ============================================================

(function() {
  'use strict';

  // --- Utility: check if we are on a post page ---
  function isPostPage() {
    return !!document.querySelector('.post-content');
  }

  // ============================================================
  // 1. Reading Progress Bar
  // ============================================================
  function initReadingProgress() {
    var bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.prepend(bar);

    window.addEventListener('scroll', function() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = Math.min(progress, 100) + '%';
    }, { passive: true });
  }

  // ============================================================
  // 2. Back to Top Button
  // ============================================================
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', '맨 위로');
    btn.title = '맨 위로';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // 3. Reading Time Badge
  // ============================================================
  function initReadingTime() {
    var content = document.querySelector('.post-content');
    if (!content) return;

    var text = content.textContent || '';
    // Korean: ~500 chars/min, English: ~200 words/min
    var koreanChars = text.replace(/[a-zA-Z0-9\s\n]/g, '').length;
    var englishWords = text.replace(/[^\x00-\x7F]/g, '').split(/\s+/).filter(function(w) { return w.length > 0; }).length;
    var minutes = Math.ceil(koreanChars / 500 + englishWords / 200);
    if (minutes < 1) minutes = 1;

    var badge = document.createElement('span');
    badge.className = 'reading-time-badge';
    badge.textContent = minutes + '분 읽기';

    var meta = document.querySelector('.post-header .post-meta');
    if (meta) {
      meta.appendChild(badge);
    }
  }

  // ============================================================
  // 4. Auto-generate Table of Contents
  // ============================================================
  function initTOC() {
    var content = document.querySelector('.post-content');
    if (!content) return;

    var headings = content.querySelectorAll('h2, h3');
    if (headings.length < 2) return;

    // Build TOC sidebar
    var sidebar = document.createElement('aside');
    sidebar.className = 'toc-sidebar';
    sidebar.setAttribute('aria-label', '목차');

    var title = document.createElement('div');
    title.className = 'toc-title';
    title.textContent = '목차';
    sidebar.appendChild(title);

    var ul = document.createElement('ul');

    headings.forEach(function(heading, index) {
      var id = heading.id || ('section-' + index);
      heading.id = id;

      var li = document.createElement('li');
      li.className = heading.tagName === 'H3' ? 'toc-h3' : 'toc-h2';

      var a = document.createElement('a');
      a.href = '#' + id;
      a.textContent = heading.textContent;
      a.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.getElementById(id);
        if (target) {
          var offset = 80;
          var top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });

      li.appendChild(a);
      ul.appendChild(li);
    });

    sidebar.appendChild(ul);
    document.body.appendChild(sidebar);

    // Active highlight on scroll
    var tocLinks = sidebar.querySelectorAll('a');
    var headingEls = Array.from(headings);

    function updateActiveTOC() {
      var scrollPos = window.scrollY + 120;
      var activeIndex = -1;

      for (var i = headingEls.length - 1; i >= 0; i--) {
        if (headingEls[i].offsetTop <= scrollPos) {
          activeIndex = i;
          break;
        }
      }

      tocLinks.forEach(function(link, i) {
        if (i === activeIndex) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', updateActiveTOC, { passive: true });
    updateActiveTOC();
  }

  // ============================================================
  // 5. Code Copy Buttons
  // ============================================================
  function initCodeCopy() {
    var codeBlocks = document.querySelectorAll('.post-content pre');
    if (!codeBlocks.length) return;

    codeBlocks.forEach(function(pre) {
      var wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      var btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.textContent = '복사';
      btn.setAttribute('aria-label', '코드 복사');

      btn.addEventListener('click', function() {
        var code = pre.querySelector('code');
        var text = code ? code.textContent : pre.textContent;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function() {
            showCopied(btn);
          });
        } else {
          // Fallback
          var textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          try { document.execCommand('copy'); showCopied(btn); } catch(e) {}
          document.body.removeChild(textarea);
        }
      });

      wrapper.appendChild(btn);
    });

    function showCopied(btn) {
      btn.textContent = '복사됨!';
      btn.classList.add('copied');
      setTimeout(function() {
        btn.textContent = '복사';
        btn.classList.remove('copied');
      }, 2000);
    }
  }

  // ============================================================
  // 6. Share Buttons
  // ============================================================
  function initShareButtons() {
    var content = document.querySelector('.post-content');
    if (!content) return;

    var section = document.createElement('div');
    section.className = 'share-section';

    var title = document.createElement('div');
    title.className = 'share-title';
    title.textContent = '공유하기';
    section.appendChild(title);

    var btnsWrap = document.createElement('div');
    btnsWrap.className = 'share-buttons';

    var pageUrl = encodeURIComponent(window.location.href);
    var pageTitle = encodeURIComponent(document.title);

    // Twitter/X
    var twitterBtn = document.createElement('button');
    twitterBtn.className = 'share-btn twitter';
    twitterBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>X';
    twitterBtn.addEventListener('click', function() {
      window.open('https://twitter.com/intent/tweet?url=' + pageUrl + '&text=' + pageTitle, '_blank', 'width=550,height=420');
    });

    // LinkedIn
    var linkedinBtn = document.createElement('button');
    linkedinBtn.className = 'share-btn linkedin';
    linkedinBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>LinkedIn';
    linkedinBtn.addEventListener('click', function() {
      window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + pageUrl, '_blank', 'width=550,height=420');
    });

    // Copy Link
    var copyBtn = document.createElement('button');
    copyBtn.className = 'share-btn copy-link';
    copyBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.484 2.529.648 3.823.454l-3.168 3.168c-2.58 2.58-6.78 2.58-9.36 0-2.58-2.58-2.58-6.78 0-9.36l4.766-4.157zm11.624-3.063c2.58 2.58 2.58 6.78 0 9.36l-4.766 4.157c-.439.439-.926.801-1.444 1.087-2.887 1.591-6.589.745-8.445-2.069l2.246-2.245c.644 1.469 2.243 2.305 3.834 1.949.599-.134 1.168-.433 1.633-.898l4.304-4.306c1.307-1.307 1.307-3.433 0-4.74-1.307-1.307-3.433-1.307-4.74 0l-1.327 1.327c-1.207-.484-2.529-.648-3.823-.454l3.168-3.168c2.58-2.58 6.78-2.58 9.36 0z"/></svg>링크 복사';
    copyBtn.addEventListener('click', function() {
      var url = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function() {
          showLinkCopied(copyBtn);
        });
      } else {
        var textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try { document.execCommand('copy'); showLinkCopied(copyBtn); } catch(e) {}
        document.body.removeChild(textarea);
      }
    });

    function showLinkCopied(btn) {
      var origHTML = btn.innerHTML;
      btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>복사됨!';
      btn.classList.add('copied');
      setTimeout(function() {
        btn.innerHTML = origHTML;
        btn.classList.remove('copied');
      }, 2000);
    }

    btnsWrap.appendChild(twitterBtn);
    btnsWrap.appendChild(linkedinBtn);
    btnsWrap.appendChild(copyBtn);
    section.appendChild(btnsWrap);

    // Insert before post-nav or at end of post-content
    var postNav = content.querySelector('.post-nav');
    if (postNav) {
      content.insertBefore(section, postNav);
    } else {
      content.appendChild(section);
    }
  }

  // ============================================================
  // 7. Related Posts
  // ============================================================
  function initRelatedPosts() {
    var content = document.querySelector('.post-content');
    if (!content) return;

    // Collect all post cards from the site by looking at any link patterns
    // We'll try to find related posts by checking the current page's tag/category
    var currentTag = '';
    var tagEl = document.querySelector('.post-header .post-tag');
    if (tagEl) {
      currentTag = tagEl.textContent.trim().toLowerCase();
    }

    // Fetch the index page to get post links
    fetch('/')
      .then(function(response) { return response.text(); })
      .then(function(html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var cards = doc.querySelectorAll('.post-card');
        var currentPath = window.location.pathname;
        var related = [];

        cards.forEach(function(card) {
          var linkEl = card.querySelector('h3 a');
          var tagEl = card.querySelector('.post-tag');
          var metaEl = card.querySelector('.post-meta');
          if (!linkEl) return;

          var href = linkEl.getAttribute('href');
          // Skip current post
          if (href && currentPath.indexOf(href.replace(/^\.?\/?/, '/').replace(/\/$/, '')) !== -1 && href.length > 2) return;
          if (currentPath === '/' + href || currentPath === href) return;

          var cardTag = tagEl ? tagEl.textContent.trim().toLowerCase() : '';
          var title = linkEl.textContent.trim();
          var meta = metaEl ? metaEl.textContent.trim() : '';

          related.push({
            href: href,
            title: title,
            tag: cardTag,
            meta: meta,
            sameTag: cardTag === currentTag && currentTag !== ''
          });
        });

        // Prioritize same-tag posts, then take up to 3
        related.sort(function(a, b) {
          if (a.sameTag && !b.sameTag) return -1;
          if (!a.sameTag && b.sameTag) return 1;
          return 0;
        });

        related = related.slice(0, 3);
        if (related.length === 0) return;

        var section = document.createElement('div');
        section.className = 'related-posts';

        var titleDiv = document.createElement('div');
        titleDiv.className = 'related-title';
        titleDiv.textContent = '관련 글';
        section.appendChild(titleDiv);

        var grid = document.createElement('div');
        grid.className = 'related-posts-grid';

        related.forEach(function(post) {
          var card = document.createElement('div');
          card.className = 'related-post-card';

          var a = document.createElement('a');
          a.href = post.href;
          a.textContent = post.title;

          card.appendChild(a);

          if (post.meta) {
            var metaSpan = document.createElement('div');
            metaSpan.className = 'related-post-meta';
            metaSpan.textContent = post.meta;
            card.appendChild(metaSpan);
          }

          grid.appendChild(card);
        });

        section.appendChild(grid);

        // Insert before post-nav or at end of post-content
        var postNav = content.querySelector('.post-nav');
        if (postNav) {
          content.insertBefore(section, postNav);
        } else {
          content.appendChild(section);
        }
      })
      .catch(function() {
        // Silently fail if fetch doesn't work (e.g. file:// protocol)
      });
  }

  // ============================================================
  // 8. Smooth Scroll for Anchor Links (enhanced)
  // ============================================================
  function initSmoothScroll() {
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var targetId = link.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  }

  // ============================================================
  // Initialize everything on DOMContentLoaded
  // ============================================================
  document.addEventListener('DOMContentLoaded', function() {
    // Always init these
    initReadingProgress();
    initBackToTop();
    initSmoothScroll();

    // Post-page only features
    if (isPostPage()) {
      initReadingTime();
      initTOC();
      initCodeCopy();
      initShareButtons();
      initRelatedPosts();
    }
  });

})();
