'use strict';

const categories = [
  { id: 'creative', label: 'Creative', icon: 'creative' },
  { id: 'business', label: 'Business', icon: 'business' },
  { id: 'digital', label: 'Digital', icon: 'digital' },
  { id: 'research', label: 'Research', icon: 'research' },
  { id: 'education', label: 'Education', icon: 'education' },
  { id: 'finance', label: 'Finance', icon: 'finance' },
  { id: 'commerce', label: 'E-commerce', icon: 'shop' },
  { id: 'tech', label: 'Tech & AI', icon: 'tech' },
  { id: 'lifestyle', label: 'Lifestyle', icon: 'lifestyle' },
  { id: 'events', label: 'Events', icon: 'events' },
  { id: 'local', label: 'Local services', icon: 'location' },
];

const experts = [
  {
    id: 'mika', name: 'Mika Villanueva', role: 'Brand & graphic designer', category: 'creative', rate: 1200,
    sample: { rating: 4.9, reviews: 86, projects: 142, skillVerified: true },
    city: 'Quezon City', skills: ['Brand identity', 'Packaging', 'Illustration'],
    summary: 'Brand identities and packaging for shops ready to look as good as the products they make.',
    bio: 'Mika starts with a mood board and two visual directions, then builds a toolkit your team can use across print and social media.',
    work: [
      ['Coffee shop identity', 'A wordmark and coffee bag packaging for a neighborhood café.', 'Coffee bags with rust and cream packaging'],
      ['Café menu system', 'A set of editable menus and stationery for a small café.', 'Dark green café menu and stationery'],
      ['Product label set', 'A flexible set of illustrated labels for a small product line.', 'Illustrated labels in several colors'],
    ],
  },
  {
    id: 'paolo', name: 'Paolo Reyes', role: 'Web developer', category: 'tech', related: ['commerce'], rate: 1500,
    sample: { rating: 4.9, reviews: 124, projects: 280, skillVerified: true },
    city: 'Makati City', skills: ['Websites', 'E-commerce', 'Accessibility'],
    summary: 'Fast, accessible websites and online stores that are easy for small teams to update.',
    bio: 'Paolo helps you plan the pages your site needs, builds a mobile-friendly site, and shows your team how to update it before handoff.',
    work: [
      ['Online shop launch', 'A responsive storefront with a clear product catalog and a handoff guide.', 'Online storefront shown on a computer and a phone'],
      ['Bakery website', 'A mobile-ready bakery site with a menu, store hours, and an order inquiry page.', 'Bakery website on a laptop'],
      ['Sales dashboard', 'A small dashboard showing how to read weekly sales and product activity.', 'Dark teal sales dashboard on a monitor'],
    ],
  },
  {
    id: 'bea', name: 'Bea Mendoza', role: 'Social media strategist', category: 'digital', rate: 950,
    sample: { rating: 4.8, reviews: 61, projects: 107, skillVerified: false },
    city: 'Cebu City', skills: ['TikTok', 'Instagram', 'Content planning'],
    summary: 'Content calendars and short video ideas for brands that want a steady social presence.',
    bio: 'Bea reviews what you already post, then creates a plan your team can actually keep up with. She can also help script and edit a first batch of videos.',
    work: [
      ['Four-week content plan', 'A posting calendar, shot list, and simple guide to tracking what works.', 'Content planning board with image tiles'],
      ['Short video launch', 'A first batch of product videos scripted for a small business.', 'Phone showing a short product video'],
      ['Social campaign', 'A six-post campaign with consistent visuals and captions.', 'Six coordinated social media posts'],
    ],
  },
  {
    id: 'nico', name: 'Nico Soriano', role: 'Small business mentor', category: 'business', related: ['finance'], rate: 1400,
    sample: { rating: 4.8, reviews: 72, projects: 119, skillVerified: true },
    city: 'Davao City', skills: ['Business planning', 'Pricing', 'Operations'],
    summary: 'Practical help with pricing, launch plans, and day-to-day decisions for small businesses.',
    bio: 'Nico works through one business decision at a time. Bring a pricing question, an idea to test, or a process that keeps getting stuck.',
    work: [
      ['Business consultation', 'A working session to set priorities before a neighborhood business launch.', 'Two people discussing business plans at a café table'],
      ['Pricing worksheet', 'A simple cost sheet and two pricing scenarios for a neighborhood food business.', 'Laptop with a pricing and costs worksheet'],
      ['Operations workshop', 'A workshop to document recurring tasks and clarify who handles each one.', 'Workshop board with organized sticky notes'],
    ],
  },
  {
    id: 'lia', name: 'Lia de Guzman', role: 'Learning designer & tutor', category: 'education', related: ['research'], rate: 800,
    sample: { rating: 4.7, reviews: 48, projects: 82, skillVerified: false },
    city: 'Pasig City', skills: ['Tutoring', 'Learning needs research', 'Workshop materials'],
    summary: 'One-on-one lessons and approachable training materials for students and small teams.',
    bio: 'Lia adapts lessons to your pace. Sessions use worked examples and short practice activities, with notes to help you keep going afterward.',
    work: [
      ['Workshop starter kit', 'A facilitator guide, short practice exercises, and a take-home reference sheet.', 'Workbook and exercise cards on a desk'],
      ['One-on-one lessons', 'A lesson series built around worked examples and short practice exercises.', 'Teacher and learner working at a study table'],
      ['Training handout', 'An illustrated handout that helps a team review the steps after training.', 'Illustrated blue and cream training handout'],
    ],
  },
];

const $ = (id) => document.getElementById(id);
const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 });
const counts = new Intl.NumberFormat('en-PH');
const dateLabel = new Intl.DateTimeFormat('en-PH', { day: 'numeric', month: 'short', year: 'numeric' });
const storageKey = 'serv.marketplace.v1';
const welcomeStorageKey = 'serv.welcome.v1';
const accountSessionKey = 'serv.account.v1';
const welcomeScreen = $('welcome');
const mobileApp = $('mobile-app');
const themeColor = document.querySelector('meta[name="theme-color"]');
const appThemeColor = themeColor.content;
const appVersion = document.querySelector('meta[name="application-version"]').content;
const dialog = $('dialog');
const dialogContent = $('dialog-content');
const routes = ['explore', 'experts', 'saved', 'projects'];
const nativeAndroid = navigator.userAgent.endsWith(' SERV-Android');
if (nativeAndroid) document.documentElement.classList.add('android-app');
const desktopMode = matchMedia(nativeAndroid ? 'not all' : '(min-width: 768px) and (any-pointer: fine)');
const visual = window.visualViewport;
const categoryName = (id) => categories.find((category) => category.id === id)?.label ?? 'Open to suggestions';
const notificationOptions = [
  ['projectUpdates', 'Project updates', 'Activity on your project briefs.'],
  ['expertRecommendations', 'Expert recommendations', 'Experts you might want to work with.'],
];
const findExpert = (id) => experts.find((expert) => expert.id === id);
const inCategory = (expert, id) => expert.category === id || Boolean(expert.related?.includes(id));
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

let storageAvailable = true;
let data = readData();
let route = 'explore';
let filter = 'all';
let query = '';
let sort = 'featured';
let toastTimer;
let dialogReturn;
let dialogBack;
let viewportFrame;
let accountName = '';
let welcomeDismissed = false;
try {
  welcomeDismissed = sessionStorage.getItem(welcomeStorageKey) === '1';
  accountName = sessionStorage.getItem(accountSessionKey) || '';
} catch {}

function syncWelcome() {
  const visible = !desktopMode.matches && !welcomeDismissed;
  welcomeScreen.hidden = !visible;
  mobileApp.hidden = visible;
  themeColor.content = visible ? '#0d1516' : appThemeColor;
  if (nativeAndroid) window.ServNative?.setWelcome(visible);
}

function scheduleTouchViewport() {
  if (!visual || viewportFrame) return;
  viewportFrame = requestAnimationFrame(() => {
    viewportFrame = 0;
    const root = document.documentElement;
    const field = document.activeElement;
    const editing = field?.matches('textarea, input:not([type]), input:is([type="text"], [type="search"], [type="number"], [type="email"], [type="url"])');
    const keyboard = !desktopMode.matches && Math.abs(visual.scale - 1) < .02 && root.clientHeight - visual.height > 96
      && (editing || root.classList.contains('keyboard-open'));
    root.classList.toggle('keyboard-open', keyboard);
    if (!keyboard) return;

    root.style.setProperty('--visible-top', `${visual.offsetTop}px`);
    root.style.setProperty('--visible-height', `${visual.height}px`);
    if (!editing || !dialog.open || !dialog.contains(field)) return;
    const bounds = field.getBoundingClientRect();
    const top = dialog.querySelector('.dialog-bar').getBoundingClientRect().bottom + 8;
    const bottom = dialog.getBoundingClientRect().bottom - 12;
    if (bottom <= top) return;
    if (bounds.top < top || (bounds.bottom > bottom && bounds.height > bottom - top)) {
      dialog.scrollTop += bounds.top - top;
    } else if (bounds.bottom > bottom) {
      dialog.scrollTop += bounds.bottom - bottom;
    }
  });
}

function readData() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    const application = saved?.expertApplication;
    return {
      saved: Array.isArray(saved?.saved) ? saved.saved.filter((id) => findExpert(id)) : [],
      projects: Array.isArray(saved?.projects) ? saved.projects.filter((project) => project && typeof project.id === 'string' && typeof project.title === 'string') : [],
      expertApplication: application && typeof application.name === 'string' && categories.some(({ id }) => id === application.category) ? application : null,
      notifications: Object.fromEntries(notificationOptions.map(([key]) => [key, saved?.notifications?.[key] === true])),
      reduceMotion: saved?.reduceMotion === true,
      liquidGlass: saved?.liquidGlass === true,
    };
  } catch {
    return { saved: [], projects: [], expertApplication: null, notifications: {}, reduceMotion: false, liquidGlass: false };
  }
}

function syncGlassPreference() {
  document.documentElement.toggleAttribute('data-liquid-glass', data.liquidGlass);
}

function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
}

function notify(message) {
  const toast = $('toast');
  clearTimeout(toastTimer);
  toast.innerHTML = `${icon(storageAvailable ? 'check' : 'clock')}${escape(storageAvailable ? message : `${message} Changes will last until this page closes.`)}`;
  toastTimer = setTimeout(() => { toast.textContent = ''; }, 3300);
}

function avatar(expert) {
  return `<span class="avatar" aria-hidden="true"><img src="assets/${expert.id}.webp" alt="" width="320" height="320"></span>`;
}

function rate(expert) {
  return `<span class="rate">${peso.format(expert.rate)}<small> / hr</small></span>`;
}

function ratingLine(expert) {
  const { rating, reviews, projects } = expert.sample;
  return `<span class="rating-line"><span class="rating-score">${icon('star')}<strong>${rating.toFixed(1)}</strong><span class="sr-only"> out of 5</span> <span>(${counts.format(reviews)}<span class="sr-only"> reviews</span>)</span></span><span class="rating-separator" aria-hidden="true">·</span><span>${counts.format(projects)} projects</span></span>`;
}

function verifiedTags(expert) {
  return `<span class="tag-list"><span class="verified-tag">${icon('shield')} Identity verified</span>${expert.sample.skillVerified ? `<span class="verified-tag">${icon('seal')} Skill verified</span>` : ''}</span>`;
}

function verifiedMark() {
  return `<span class="verified-mark" aria-hidden="true">${icon('verified')}</span>`;
}

function skillTags(expert, limit = expert.skills.length) {
  return `<span class="tag-list">${expert.skills.slice(0, limit).map((skill) => `<span class="skill-tag">${escape(skill)}</span>`).join('')}</span>`;
}

function saveButton(expert) {
  const saved = data.saved.includes(expert.id);
  return `<button type="button" class="icon-button" data-action="save" data-id="${expert.id}" aria-label="Save ${expert.name}" aria-pressed="${saved}">${icon('heart')}</button>`;
}

function expertCard(expert, list) {
  const info = `${list}-${expert.id}-info`;
  return `<article class="expert-card" data-expert="${expert.id}">
    <button type="button" class="expert-open" data-action="profile" data-id="${expert.id}" aria-label="View profile for ${expert.name}" aria-describedby="${info}">
      ${avatar(expert)}<span class="expert-info"><span class="expert-name">${expert.name}${verifiedMark()}</span><span class="expert-role">${expert.role}</span><span class="expert-details" id="${info}">${ratingLine(expert)}${verifiedTags(expert)}${rate(expert)}${skillTags(expert, 2)}</span></span>
    </button>${saveButton(expert)}
  </article>`;
}

function renderFeatured() {
  $('featured-list').innerHTML = experts.slice(0, 2).map((expert) => {
    const info = `featured-${expert.id}-info`;
    return `<article class="expert-card featured-expert"><button type="button" class="expert-open" data-action="profile" data-id="${expert.id}" aria-label="View profile for ${expert.name}" aria-describedby="${info}">${avatar(expert)}<span class="expert-info"><span class="expert-name">${expert.name}${verifiedMark()}</span><span class="featured-info" id="${info}"><span class="expert-role">${expert.role}</span><span class="featured-meta"><span class="rating-line"><span class="rating-score">${icon('star')}<strong>${expert.sample.rating.toFixed(1)}</strong><span class="sr-only"> out of 5</span></span></span>${rate(expert)}</span></span></span></button>${saveButton(expert)}</article>`;
  }).join('');
}

function renderCategories() {
  const categoryButton = ({ id, label, icon: glyph }) => `<button type="button" class="category-button tone-${id}" data-action="category" data-id="${id}"><span class="category-icon">${icon(glyph)}</span><span>${label}</span></button>`;
  $('home-categories').innerHTML = categories.slice(0, 4).map(categoryButton).join('');
  $('explore-categories').innerHTML = categories.map(categoryButton).join('');
}

function emptyState(title, description, action, label, link = '') {
  const control = link ? `<a class="button button-dark" href="${link}">${label}</a>` : `<button class="button button-dark" type="button" data-action="${action}">${label}</button>`;
  return `<div class="empty"><h3>${title}</h3><p>${description}</p>${control}</div>`;
}

function matchesQuery(expert) {
  const searchable = [expert.name, expert.role, expert.city, categoryName(expert.category), ...(expert.related ?? []).map(categoryName), expert.summary, ...expert.skills].join(' ').toLowerCase();
  return query.toLowerCase().split(/\s+/).every((word) => searchable.includes(word));
}

function renderResults() {
  document.querySelectorAll('[data-action="sort"]').forEach((button) => button.setAttribute('aria-pressed', button.dataset.id === sort));
  const filtered = Boolean(query || filter !== 'all');
  $('explore-directory').hidden = filtered;
  $('clear-filters').hidden = !filtered;
  const list = experts.filter((expert) => (filter === 'all' || inCategory(expert, filter)) && matchesQuery(expert));
  if (sort === 'low') list.sort((a, b) => a.rate - b.rate);
  if (sort === 'high') list.sort((a, b) => b.rate - a.rate);
  $('results-title').textContent = query ? 'Search results' : filter === 'all' ? 'Meet the experts' : categoryName(filter);
  $('results-summary').textContent = `${list.length} ${list.length === 1 ? 'expert' : 'experts'}${query ? ` for “${query}”` : ''}`;
  $('expert-list').innerHTML = list.length ? list.map((expert) => expertCard(expert, 'result')).join('') : emptyState('No matching experts', 'Try another search or browse all profiles.', 'clear', 'Show all experts');
  $('expert-list').setAttribute('aria-busy', 'false');
}

function renderSaved() {
  const list = data.saved.map(findExpert).filter(Boolean);
  $('saved-list').innerHTML = list.length ? list.map((expert) => expertCard(expert, 'saved')).join('') : emptyState('Your list is empty', 'Tap the heart on a profile to save it for later.', 'browse', 'Browse experts', '#experts');
  $('saved-count').textContent = list.length;
  $('saved-count').hidden = list.length === 0;
}

function deadlineText(value) {
  const date = new Date(`${value}T12:00:00`);
  return value && Number.isFinite(date.getTime()) ? dateLabel.format(date) : 'Flexible deadline';
}

function renderProjects() {
  $('project-list').innerHTML = data.projects.length ? data.projects.map((project) => {
    const selected = findExpert(project.expert);
    const status = project.completed ? 'Completed' : selected ? 'In progress' : 'Open';
    return `<article class="project-card"><div><h2>${escape(project.title)}</h2><p><span class="project-status">${status}</span> · ${escape(categoryName(project.category))} · ${peso.format(project.budget)}</p>${selected ? `<p>Expert: ${selected.name}${project.rating ? ` · Your rating: ${escape(project.rating)}/5` : ''}</p>` : ''}</div><button class="button button-quiet" type="button" data-action="project" data-id="${escape(project.id)}">View project ${icon('up-right')}</button></article>`;
  }).join('') : emptyState('No projects yet', 'Tell us what you need and compare experts for the job.', 'post', 'Post your first project');
}

function setRoute(next, focus = true) {
  route = routes.includes(next) ? next : 'explore';
  for (const name of routes) {
    $(`view-${name}`).toggleAttribute('hidden', name !== route);
    const link = document.querySelector(`[data-nav="${name}"]`);
    if (name === route) {
      if (!link.hasAttribute('aria-current')) link.setAttribute('aria-current', 'page');
    } else link.removeAttribute('aria-current');
  }
  if (focus) {
    window.scrollTo(0, 0);
    $(route === 'explore' ? 'main' : `${route}-title`).focus({ preventScroll: true });
  }
}

function navigate(next) {
  if (location.hash !== `#${next}`) history.pushState(null, '', `#${next}`);
  setRoute(next);
}

function showResults(text = '', category = 'all', order = sort) {
  const changed = query !== text || filter !== category || sort !== order;
  query = text;
  filter = category;
  sort = order;
  updateSearchInput($('expert-search'), query);
  if (changed) renderResults();
  navigate('experts');
}

function updateSearchInput(input, value = input.value) {
  if (input.value !== value) input.value = value;
  input.form.querySelector('[data-clear-search]').hidden = input.value.length === 0;
}

function toggleSave(id, trigger) {
  const expert = findExpert(id);
  if (!expert) return;
  const saved = !data.saved.includes(id);
  data.saved = saved ? [...data.saved, id] : data.saved.filter((item) => item !== id);
  persist();
  const saveInList = trigger.closest('#saved-list');
  renderSaved();
  document.querySelectorAll(`[data-action="save"][data-id="${id}"]`).forEach((button) => {
    button.setAttribute('aria-pressed', saved);
  });
  if (saveInList && !saved) ($('saved-list').querySelector('button, a') || $('saved-title')).focus({ preventScroll: true });
  if (dialog.open) {
    const status = dialog.querySelector('[data-dialog-status]');
    if (status) status.textContent = storageAvailable ? (saved ? 'Expert saved.' : 'Expert removed from Saved.') : 'Changes will last until this page closes.';
  } else notify(saved ? `${expert.name} saved.` : `${expert.name} removed from Saved.`);
}

function showDialog(markup, trigger, { mode = '', label = '', back } = {}) {
  if (!dialog.open) dialogReturn = trigger;
  dialogBack = back;
  dialog.className = mode ? `dialog dialog-${mode}-mode` : 'dialog';
  $('dialog-label').textContent = label;
  const closeButton = dialog.querySelector('.close-button');
  const accountHome = mode === 'account-home';
  closeButton.setAttribute('aria-label', accountHome ? 'Close account' : 'Go back');
  closeButton.querySelector('use').setAttribute('href', accountHome ? '#i-close' : '#i-back');
  dialogContent.innerHTML = `<div class="dialog-page">${markup}</div>`;
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  $('dialog-title').focus({ preventScroll: true });
}

function accountMark() {
  if (!accountName) return icon('account');
  const initials = accountName.split(/\s+/).slice(0, 2).map((part) => Array.from(part)[0]).join('').toLocaleUpperCase();
  return `<span class="account-initial" aria-hidden="true">${escape(initials)}</span>`;
}

function updateAccountButton() {
  const button = $('account-button');
  button.innerHTML = accountMark();
  button.setAttribute('aria-label', accountName ? `Account: ${accountName}` : 'No profile');
}

function setAccountName(name) {
  accountName = name;
  try {
    if (name) sessionStorage.setItem(accountSessionKey, name);
    else sessionStorage.removeItem(accountSessionKey);
  } catch {}
  updateAccountButton();
}

function accountRow(action, symbol, label, detail = '') {
  return `<button type="button" class="account-row" data-action="${action}">${icon(symbol)}<span>${label}${detail ? `<small>${detail}</small>` : ''}</span>${icon('chevron')}</button>`;
}

function appSettings() {
  return `<section class="account-settings" aria-labelledby="app-settings-title"><h3 id="app-settings-title">App settings</h3>
    <div class="account-card">
      ${accountRow('account-notifications', 'bell', 'Notifications')}
      ${accountRow('account-privacy', 'shield', 'Privacy &amp; data')}
      ${accountRow('app-accessibility', 'accessibility', 'Accessibility')}
    </div>
  </section>`;
}

function openAccount(trigger, message = '') {
  const version = `<p class="account-version">Version ${escape(appVersion)}</p>`;
  if (!accountName) {
    showDialog(`<div class="account-screen account-home">
      <div class="account-avatar"><div class="account-symbol" aria-hidden="true">${accountMark()}</div></div>
      <h2 id="dialog-title" tabindex="-1">No profile</h2>
      <div class="account-actions"><button type="button" class="button button-dark" data-action="account-create">Create account</button><button type="button" class="button button-outline" data-action="account-google">Continue with Google</button></div>
      <p class="dialog-note" id="account-status" role="status"></p>
      ${appSettings()}
      ${version}
      </div>`, trigger, { mode: 'account-home', label: 'Account' });
    return;
  }

  const application = data.expertApplication;
  showDialog(`<div class="account-screen account-home">
    <div class="account-avatar">
      <div class="account-symbol" aria-hidden="true">${accountMark()}</div>
      <button type="button" class="icon-button account-edit" data-action="account-edit-profile" aria-label="Edit profile">${icon('creative')}</button>
    </div>
    <h2 id="dialog-title" tabindex="-1">${escape(accountName)}</h2>
    <p class="dialog-note" role="status">${escape(message)}</p>
    <div class="account-card account-expert">${accountRow('account-expert', 'business', application ? 'Your expert application' : 'Apply as expert', application ? 'View or update your application' : 'Share your skills and experience')}</div>
    <section class="account-settings" aria-labelledby="account-settings-title"><h3 id="account-settings-title">Account</h3>
      <div class="account-card">${accountRow('account-details', 'account', 'Personal details')}</div>
    </section>
    ${appSettings()}
    <button type="button" class="text-action account-card account-sign-out" data-action="account-sign-out">Sign out</button>
    ${version}
    </div>`, trigger, { mode: 'account-home', label: 'Account' });
}

function accountBack(trigger, action = trigger?.dataset.action) {
  openAccount(trigger);
  if (action) dialog.querySelector(`[data-action="${action}"]`)?.focus({ preventScroll: true });
}

function accountForm(trigger, edit = false) {
  const title = edit ? 'Personal details' : 'Create account';
  showDialog(`<div class="account-subpage"><h2 id="dialog-title" tabindex="-1">${title}</h2>
    <form id="account-form"><div class="content-group"><label class="field">Display name <input name="displayName" type="text" value="${escape(accountName)}" autocomplete="nickname" enterkeyhint="done" maxlength="48" required></label></div>
    <p class="form-error" id="account-error" role="alert" hidden>Enter a display name.</p>
    <div class="dialog-actions"><button class="button button-dark" type="submit">${edit ? 'Save changes' : 'Continue'}</button></div></form></div>`,
  trigger, { label: 'Account', back: () => accountBack(trigger) });
}

function accountNotifications(trigger) {
  showDialog(`<div class="account-subpage"><h2 id="dialog-title" tabindex="-1">Notifications</h2>
    <p class="dialog-lead">Your preferences are saved here. SERV doesn’t send notifications yet.</p>
    <div class="list-group" id="notification-settings">${notificationOptions.map(([key, name, description]) => `<label class="account-preference"><span>${name}<small>${description}</small></span><input type="checkbox" role="switch" name="${key}"${data.notifications[key] ? ' checked' : ''}><span class="switch-track" aria-hidden="true"></span></label>`).join('')}</div>
    <p class="dialog-note" id="notification-status" role="status"></p></div>`, trigger, { label: 'Account', back: () => accountBack(trigger) });
}

function accountPrivacy(trigger) {
  showDialog(`<div class="account-subpage"><h2 id="dialog-title" tabindex="-1">Privacy &amp; data</h2>
    <div class="content-group account-data">
      <h3>On this device</h3><p>Saved experts, projects, preferences, and expert applications are stored on this device.</p>
      <h3>Account connections</h3><p>Your display name stays for this visit. Google sign-in isn’t connected.</p>
    </div></div>`,
  trigger, { label: 'Account', back: () => accountBack(trigger) });
}

function appAccessibility(trigger) {
  showDialog(`<div class="account-subpage"><h2 id="dialog-title" tabindex="-1">Accessibility</h2>
    <div class="list-group" id="accessibility-settings">
      <label class="account-preference"><span>Reduce motion<small>Turn off tab, screen, and button animations.</small></span><input type="checkbox" role="switch" name="reduceMotion"${data.reduceMotion ? ' checked' : ''}><span class="switch-track" aria-hidden="true"></span></label>
      <label class="account-preference">
        <span><span id="liquid-glass-title">Liquid Glass</span> <span class="setting-tag" id="liquid-glass-tag">Experimental</span>
          <small id="liquid-glass-description">Adds a glass effect to the bottom bar. May slow down scrolling.</small>
        </span>
        <input type="checkbox" role="switch" name="liquidGlass" aria-labelledby="liquid-glass-title" aria-describedby="liquid-glass-tag liquid-glass-description"${data.liquidGlass ? ' checked' : ''}>
        <span class="switch-track" aria-hidden="true"></span>
      </label>
    </div>
    <p class="dialog-note" id="accessibility-status" role="status"></p></div>`,
  trigger, { label: 'Account', back: () => accountBack(trigger) });
}

function expertApplicationForm(trigger) {
  const application = data.expertApplication;
  const choices = categories.map(({ id, label }) => `<option value="${id}"${application?.category === id ? ' selected' : ''}>${label}</option>`).join('');
  showDialog(`<div class="account-subpage"><h2 id="dialog-title" tabindex="-1">${application ? 'Edit expert application' : 'Apply as expert'}</h2>
    <p class="dialog-lead">Tell us what you do and the projects you can help with.</p>
    <form id="expert-application-form">
      <div class="form-grid content-group">
        <label class="field">Full name <input name="name" autocomplete="name" value="${escape(application?.name ?? accountName)}" maxlength="80" required></label>
        <label class="field">Contact email <input name="email" type="email" autocomplete="email" value="${escape(application?.email ?? '')}" maxlength="254" required></label>
        <label class="field">Area of expertise <select name="category" required><option value="">Choose a category</option>${choices}</select></label>
        <label class="field">Relevant experience <textarea name="experience" placeholder="Describe the work you do and a project you’ve worked on." maxlength="1500" required>${escape(application?.experience ?? '')}</textarea></label>
        <label class="field">Portfolio link (optional) <input name="portfolio" type="url" autocomplete="url" placeholder="https://…" maxlength="500" value="${escape(application?.portfolio ?? '')}"></label>
      </div>
      <p class="dialog-note" id="application-note">Your application is saved on this device.</p>
      <p class="form-error" id="application-error" role="alert" hidden></p>
      <div class="dialog-actions"><button class="button button-dark" type="submit" aria-describedby="application-note">${application ? 'Save changes' : 'Submit application'}</button></div>
    </form></div>`, trigger, { label: 'Account', back: () => application ? expertApplicationSummary(trigger) : accountBack(trigger, 'account-expert') });
}

function expertApplicationSummary(trigger, justSaved = false) {
  const application = data.expertApplication;
  if (!application) return expertApplicationForm(trigger);
  const title = justSaved && storageAvailable ? 'Application saved' : 'Expert application';
  const note = storageAvailable ? 'Saved on this device.' : 'This application will last until this page closes.';
  showDialog(`<div class="account-subpage"><h2 id="dialog-title" tabindex="-1">${title}</h2><p class="dialog-lead">${note}</p>
    <p class="application-summary content-group"><strong>${escape(application.name)}</strong><span>${categoryName(application.category)}</span></p>
    <div class="account-actions"><button class="button button-dark" type="button" data-action="account-expert-edit">Edit application</button><button class="button button-outline" type="button" data-action="account">Back to account</button></div></div>`,
  trigger, { label: 'Account', back: () => accountBack(trigger, 'account-expert') });
}

function portfolioImage(expert, slot) {
  return `assets/portfolio-${expert.id}-${slot + 1}.webp`;
}

function portfolioGrid(expert, projectId) {
  const project = projectId ? ` data-project="${escape(projectId)}"` : '';
  return `<div class="portfolio-grid">${expert.work.map(([title], slot) => `<button class="portfolio-card" type="button" data-action="portfolio" data-id="${expert.id}" data-slot="${slot}"${project}><img src="${portfolioImage(expert, slot)}" alt="" width="400" height="240" loading="lazy"><span>${escape(title)}</span></button>`).join('')}</div>`;
}

function portfolioDetail(id, slot, trigger, projectId) {
  const expert = findExpert(id);
  const item = expert?.work[slot];
  if (!item) return;
  const [title, description, alt] = item;
  showDialog(`<h2 id="dialog-title" tabindex="-1">${escape(title)}</h2><p class="dialog-lead">Portfolio · ${expert.name}</p><figure class="portfolio-detail"><img src="${portfolioImage(expert, slot)}" alt="${escape(alt)}" width="400" height="240"><figcaption>${escape(description)}</figcaption></figure>`, trigger, { label: 'Portfolio', back: () => {
    profile(id, trigger, projectId);
    dialog.querySelector(`[data-action="portfolio"][data-slot="${slot}"]`)?.focus();
  } });
}

function profile(id, trigger, projectId) {
  const expert = findExpert(id);
  if (!expert) return;
  const primary = projectId ? `<button class="button button-dark" type="button" data-action="project" data-id="${escape(projectId)}">Back to project</button>` : `<button class="button button-dark" type="button" data-action="post" data-id="${expert.id}">Start a project</button>`;
  const reviews = data.projects.filter((item) => item.expert === id && item.completed && item.rating);
  const panels = [
    ['Portfolio', portfolioGrid(expert, projectId)],
    ['Reviews', `<h3>Rating overview</h3>${ratingLine(expert)}<h3 class="review-heading">Your project ratings</h3>${reviews.length ? reviews.map((item) => `<p>${escape(item.title)} · ${escape(item.rating)}/5</p>`).join('') : '<p>No ratings from your projects yet.</p>'}`],
    ['Services', `<h3>Skills and services</h3>${skillTags(expert)}`],
    ['About', `<p>${expert.bio}</p>`],
  ];
  const tabs = panels.map(([name], i) => `<button type="button" role="tab" id="profile-tab-${i}" aria-controls="profile-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-action="profile-tab" data-id="${i}">${name}</button>`).join('');
  showDialog(`<div class="profile-cover"><img class="profile-cover-photo" src="${portfolioImage(expert, 0)}" alt="" width="400" height="240"><img class="profile-avatar" src="assets/${expert.id}.webp" alt="" width="320" height="320"></div>
    <div class="profile-sheet"><div class="profile-heading"><div><h2 id="dialog-title" tabindex="-1">${expert.name}${verifiedMark()}</h2><p>${expert.role}</p></div>${saveButton(expert)}</div>
    <div class="profile-overview content-group"><div class="profile-stats">${ratingLine(expert)}${verifiedTags(expert)}</div>
    <div class="profile-facts"><span>${icon('location')}${expert.city}</span>${rate(expert)}</div><p class="profile-intro">${expert.summary}</p></div>
    <div class="profile-tabs" role="tablist" aria-label="Profile details">${tabs}</div>
    ${panels.map(([, content], i) => `<div id="profile-panel-${i}" class="profile-panel content-group" role="tabpanel" aria-labelledby="profile-tab-${i}" tabindex="0"${i ? ' hidden' : ''}>${content}</div>`).join('')}
    <div class="dialog-actions">${primary}</div><p class="dialog-note" data-dialog-status aria-live="polite"></p></div>`, trigger, { mode: 'profile', label: 'Profile', back: projectId ? () => projectDetail(projectId, trigger) : undefined });
}

function selectProfileTab(index, focus = false) {
  dialog.querySelectorAll('[role="tab"]').forEach((tab, i) => {
    const active = i === index;
    tab.setAttribute('aria-selected', active);
    tab.tabIndex = active ? 0 : -1;
    $(`profile-panel-${i}`).hidden = !active;
    if (active && focus) tab.focus();
  });
}

function projectForm(expert, trigger) {
  const options = categories.map(({ id, label }) => `<option value="${id}"${expert?.category === id ? ' selected' : ''}>${label}</option>`).join('');
  showDialog(`<h2 id="dialog-title" tabindex="-1">Post a project</h2>
    <p class="dialog-lead">${expert ? `Start a brief for the kind of work ${expert.name} does.` : 'Share what you need, your budget, and when you need it.'}</p>
    <form id="project-form"><div class="form-grid content-group">
      <label class="field wide">Project title <input name="title" maxlength="90" required placeholder="e.g. Build an online shop"></label>
      <label class="field wide">What do you need done? <textarea name="brief" maxlength="1400" required placeholder="Describe the work and what a good result looks like."></textarea></label>
      <label class="field">Expertise <select name="category"><option value="all">I’m open to suggestions</option>${options}</select></label>
      <label class="field">Budget (₱) <input name="budget" type="number" inputmode="numeric" min="1" max="100000000" step="1" required placeholder="e.g. 15000"></label>
      <label class="field wide">Deadline (optional) <input name="deadline" type="date"></label>
    </div><p class="form-error" id="form-error" role="alert" hidden></p>
    <div class="dialog-actions"><button class="button button-dark" type="submit">Post project</button></div>
    <p class="dialog-note">Your project is saved on this device.</p></form>`, trigger, { back: expert ? () => profile(expert.id, trigger) : undefined });
}

function projectDetail(id, trigger, message = '') {
  const project = data.projects.find((item) => item.id === id);
  if (!project) return;
  const key = escape(id);
  const selected = findExpert(project.expert);
  const ranked = [...experts].sort((a, b) => Number(inCategory(b, project.category)) - Number(inCategory(a, project.category)));
  const suggested = !selected ? `<h3>Compare experts</h3><ul class="match-list">${ranked.map((expert) => `<li class="match match-with-actions">${avatar(expert)}<div class="match-text"><strong>${expert.name}${verifiedMark()}</strong><p>${expert.role} · ${peso.format(expert.rate)}/hr</p></div><div class="match-actions"><button type="button" class="text-action" data-action="profile" data-id="${expert.id}" data-project="${key}" aria-label="View profile for ${expert.name}">Profile</button><button type="button" class="button button-dark" data-action="select" data-id="${key}" data-expert="${expert.id}" aria-label="Select ${expert.name}">Select</button></div></li>`).join('')}</ul>` : `<h3>${project.completed ? 'Completed with' : 'Selected expert'}</h3><div class="match">${avatar(selected)}<div class="match-text"><strong>${selected.name}${verifiedMark()}</strong><p>${selected.role}</p></div><button type="button" class="text-action" data-action="profile" data-id="${selected.id}" data-project="${key}">View profile</button></div>`;
  const rating = project.completed ? `<form class="dialog-actions rating-form" data-project="${key}"><label class="field">Your rating <select name="rating" required><option value="">Choose a rating</option>${[5, 4, 3, 2, 1].map((n) => `<option value="${n}"${Number(project.rating) === n ? ' selected' : ''}>${n} / 5</option>`).join('')}</select></label><button type="submit" class="button button-dark">Save rating</button></form>` : '';
  const title = project.completed ? `<div class="completion-banner"><span class="completion-mark">${icon('check')}</span><h2 id="dialog-title" tabindex="-1">Project complete!</h2><p>Your project is marked complete.</p></div><h3>${escape(project.title)}</h3>` : `<h2 id="dialog-title" tabindex="-1">${escape(project.title)}</h2>`;
  showDialog(`${title}
    <p class="dialog-lead">${project.completed ? '' : `<strong>${selected ? 'In progress' : 'Open'}</strong> · `}${escape(categoryName(project.category))} · ${peso.format(project.budget)} · ${deadlineText(project.deadline)}</p>
    <p class="brief content-group">${escape(project.brief)}</p><section class="detail-section">${suggested}</section>${rating}
    <div class="dialog-actions">${selected && !project.completed ? `<button type="button" class="button button-dark" data-action="complete" data-id="${key}">${icon('check')} Mark complete</button><button type="button" class="button button-quiet" data-action="unselect" data-id="${key}">Change expert</button>` : ''}<button type="button" class="text-action" data-action="delete-confirm" data-id="${key}">Delete project</button></div>
    <p class="dialog-note" role="status"${message ? '' : ' hidden'}>${escape(message)}</p>`, trigger, { mode: project.completed ? 'complete' : '', label: 'Project' });
}

function deleteConfirmation(id, trigger) {
  const project = data.projects.find((item) => item.id === id);
  if (!project) return;
  showDialog(`<h2 id="dialog-title" tabindex="-1">Delete this project?</h2><p class="dialog-lead">“${escape(project.title)}” will be removed from this device.</p><div class="dialog-actions"><button class="button button-danger" type="button" data-action="delete" data-id="${escape(id)}">Delete project</button><button class="button button-quiet" type="button" data-action="project" data-id="${escape(id)}">Keep project</button></div>`, trigger, { back: () => projectDetail(id, trigger) });
}

function updateProject(id, changes, trigger, message) {
  const project = data.projects.find((item) => item.id === id);
  if (!project) return;
  Object.assign(project, changes);
  persist();
  renderProjects();
  projectDetail(id, trigger, storageAvailable ? message : `${message} Changes will last until this page closes.`);
}

document.addEventListener('click', (event) => {
  const standardClick = !event.button && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey;
  const button = event.target.closest('[data-action]');
  if (!button) {
    const next = event.target.closest('a[href^="#"]')?.hash.slice(1);
    if (!event.defaultPrevented && standardClick && routes.includes(next)) {
      event.preventDefault();
      navigate(next);
    }
    return;
  }
  const { action, id, project, expert } = button.dataset;
  switch (action) {
    case 'account': openAccount(button); break;
    case 'account-create': accountForm(button); break;
    case 'account-edit-profile':
    case 'account-details': accountForm(button, true); break;
    case 'account-notifications': accountNotifications(button); break;
    case 'account-privacy': accountPrivacy(button); break;
    case 'app-accessibility': appAccessibility(button); break;
    case 'account-expert': expertApplicationSummary(button); break;
    case 'account-expert-edit': expertApplicationForm(button); break;
    case 'account-google': $('account-status').textContent = 'Google sign-in isn’t connected.'; break;
    case 'account-sign-out':
      setAccountName('');
      openAccount(button);
      break;
    case 'browse':
      if (!standardClick) break;
      event.preventDefault();
      showResults();
      break;
    case 'category':
      showResults('', id);
      break;
    case 'clear':
      showResults('', 'all', 'featured');
      break;
    case 'sort':
      sort = id;
      renderResults();
      break;
    case 'save': toggleSave(id, button); break;
    case 'profile': profile(id, button, project); break;
    case 'portfolio': portfolioDetail(id, Number(button.dataset.slot), button, project); break;
    case 'profile-tab': selectProfileTab(Number(id)); break;
    case 'post': projectForm(findExpert(id), button); break;
    case 'project': projectDetail(id, button); break;
    case 'select': updateProject(id, { expert }, button, `${findExpert(expert).name} selected.`); break;
    case 'unselect': updateProject(id, { expert: null }, button, 'Expert selection cleared.'); break;
    case 'complete': updateProject(id, { completed: true }, button, 'Project marked complete.'); break;
    case 'delete-confirm': deleteConfirmation(id, button); break;
    case 'delete':
      data.projects = data.projects.filter((item) => item.id !== id);
      persist();
      renderProjects();
      dialog.close();
      notify('Project deleted.');
      break;
    case 'close':
      if (dialogBack) dialogBack();
      else dialog.close();
      break;
  }
});

document.querySelectorAll('[data-search]').forEach((form) => {
  const input = form.elements.q;
  const clear = form.querySelector('[data-clear-search]');
  input.addEventListener('input', () => updateSearchInput(input));
  clear.addEventListener('pointerdown', (event) => {
    if (document.activeElement === input) event.preventDefault();
  });
  clear.addEventListener('click', () => {
    input.focus({ preventScroll: true });
    updateSearchInput(input, '');
    if (input.id === 'expert-search' && query) {
      query = '';
      renderResults();
    }
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    showResults(input.value.trim());
  });
});

dialog.addEventListener('keydown', (event) => {
  if (!event.target.matches('[role="tab"]')) return;
  const index = Number(event.target.dataset.id);
  const count = dialog.querySelectorAll('[role="tab"]').length;
  const next = { ArrowLeft: (index + count - 1) % count, ArrowRight: (index + 1) % count, Home: 0, End: count - 1 }[event.key];
  if (next !== undefined) {
    event.preventDefault();
    selectProfileTab(next, true);
  }
});

dialog.addEventListener('change', (event) => {
  const input = event.target;
  if (input.matches('#accessibility-settings input')) {
    if (input.name === 'liquidGlass') {
      data.liquidGlass = input.checked;
      syncGlassPreference();
    } else {
      data.reduceMotion = input.checked;
      document.documentElement.toggleAttribute('data-reduce-motion', data.reduceMotion);
    }
    persist();
    $('accessibility-status').textContent = storageAvailable ? 'Preference saved.' : 'Changes will last until this page closes.';
    return;
  }
  if (!input.matches('#notification-settings input')) return;
  data.notifications[input.name] = input.checked;
  persist();
  $('notification-status').textContent = storageAvailable ? 'Preferences saved.' : 'Changes will last until this page closes.';
});

dialog.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const values = new FormData(form);
  if (form.id === 'account-form') {
    const name = values.get('displayName').trim().replace(/\s+/g, ' ');
    if (!name) {
      $('account-error').hidden = false;
      form.elements.displayName.focus();
      return;
    }
    const message = accountName ? 'Profile updated.' : 'Profile created.';
    setAccountName(name);
    openAccount(event.submitter, message);
    return;
  }
  if (form.id === 'expert-application-form') {
    const application = Object.fromEntries(['name', 'email', 'category', 'experience', 'portfolio'].map((key) => [key, values.get(key).trim()]));
    const invalid = !application.name ? ['name', 'Enter your full name.']
      : !categories.some(({ id }) => id === application.category) ? ['category', 'Choose your area of expertise.']
      : !application.experience ? ['experience', 'Tell us about your experience.']
      : application.portfolio && !/^https?:\/\//i.test(application.portfolio) ? ['portfolio', 'Enter a link starting with https:// or http://.']
      : null;
    if (invalid) {
      const [field, message] = invalid;
      $('application-error').textContent = message;
      $('application-error').hidden = false;
      form.elements.namedItem(field).focus();
      return;
    }
    data.expertApplication = application;
    persist();
    expertApplicationSummary(event.submitter, true);
    return;
  }
  if (form.matches('.rating-form')) {
    const rating = Number(values.get('rating'));
    if ([1, 2, 3, 4, 5].includes(rating)) updateProject(form.dataset.project, { rating }, event.submitter, 'Your rating was saved.');
    return;
  }
  if (form.id !== 'project-form') return;
  const title = values.get('title').trim();
  const brief = values.get('brief').trim();
  const budget = Number(values.get('budget'));
  if (!title || !brief || !Number.isInteger(budget) || budget < 1) {
    $('form-error').textContent = 'Enter a project title, a brief, and a valid budget.';
    $('form-error').hidden = false;
    form.elements[!title ? 'title' : !brief ? 'brief' : 'budget'].focus();
    return;
  }
  const id = globalThis.crypto?.randomUUID?.() ?? `project-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  data.projects.unshift({ id, title, brief, budget, category: values.get('category'), deadline: values.get('deadline'), expert: null, completed: false });
  persist();
  renderProjects();
  dialog.close();
  navigate('projects');
  notify('Project saved.');
});

dialog.addEventListener('close', () => {
  if (desktopMode.matches) $('desktop-title').focus({ preventScroll: true });
  else if (dialogReturn?.isConnected && !dialogReturn.closest('[hidden]')) dialogReturn.focus({ preventScroll: true });
  else $(route === 'explore' ? 'main' : `${route}-title`).focus({ preventScroll: true });
  dialogReturn = null;
  dialogBack = null;
});

document.querySelector('.skip-link').addEventListener('click', (event) => {
  event.preventDefault();
  $('main').focus();
});

window.addEventListener('hashchange', () => setRoute(location.hash.slice(1)));
document.addEventListener('pointerdown', (event) => {
  document.documentElement.toggleAttribute('data-touch-input', event.pointerType === 'touch');
}, { capture: true, passive: true });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Tab' || event.key.startsWith('Arrow')) {
    document.documentElement.removeAttribute('data-touch-input');
  }
}, true);
$('welcome-continue').addEventListener('click', () => {
  welcomeDismissed = true;
  try {
    sessionStorage.setItem(welcomeStorageKey, '1');
  } catch {}
  syncWelcome();
  setRoute(route);
});
desktopMode.addEventListener('change', () => {
  if (desktopMode.matches && dialog.open) dialog.close();
  syncWelcome();
  scheduleTouchViewport();
});
visual?.addEventListener('resize', scheduleTouchViewport, { passive: true });
visual?.addEventListener('scroll', scheduleTouchViewport, { passive: true });
document.addEventListener('focusin', scheduleTouchViewport);
document.addEventListener('focusout', scheduleTouchViewport);

document.documentElement.toggleAttribute('data-reduce-motion', data.reduceMotion);
syncGlassPreference();
syncWelcome();
updateAccountButton();
renderCategories();
renderFeatured();
renderSaved();
renderProjects();
setRoute(location.hash.slice(1), false);
requestAnimationFrame(renderResults);
