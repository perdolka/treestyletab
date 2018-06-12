/* ***** BEGIN LICENSE BLOCK ***** 
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is the Tree Style Tab.
 *
 * The Initial Developer of the Original Code is YUKI "Piro" Hiroshi.
 * Portions created by the Initial Developer are Copyright (C) 2011-2018
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s): YUKI "Piro" Hiroshi <piro.outsider.reflex@gmail.com>
 *                 wanabe <https://github.com/wanabe>
 *                 Tetsuharu OHZEKI <https://github.com/saneyuki>
 *                 Xidorn Quan <https://github.com/upsuper> (Firefox 40+ support)
 *                 lv7777 (https://github.com/lv7777)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ******/
'use strict';

import {
  configs
} from './common.js';
import * as Constants from './constants.js';
import TabFavIconHelper from '../TabFavIconHelper.js';
import * as Tabs from './tabs.js';

export const kREGISTER_SELF         = 'register-self';
export const kUNREGISTER_SELF       = 'unregister-self';
export const kPING                  = 'ping';
export const kNOTIFY_READY          = 'ready';
export const kNOTIFY_SHUTDOWN       = 'shutdown'; // defined but not notified for now.
export const kNOTIFY_SIDEBAR_SHOW   = 'sidebar-show';
export const kNOTIFY_SIDEBAR_HIDE   = 'sidebar-hide';
export const kNOTIFY_TAB_CLICKED    = 'tab-clicked'; // for backward compatibility
export const kNOTIFY_TAB_MOUSEDOWN  = 'tab-mousedown';
export const kNOTIFY_TAB_MOUSEUP    = 'tab-mouseup';
export const kNOTIFY_TABBAR_CLICKED = 'tabbar-clicked'; // for backward compatibility
export const kNOTIFY_TABBAR_MOUSEDOWN = 'tabbar-mousedown';
export const kNOTIFY_TABBAR_MOUSEUP = 'tabbar-mouseup';
export const kNOTIFY_TAB_MOUSEMOVE  = 'tab-mousemove';
export const kNOTIFY_TAB_MOUSEOVER  = 'tab-mouseover';
export const kNOTIFY_TAB_MOUSEOUT   = 'tab-mouseout';
export const kNOTIFY_TAB_DRAGREADY  = 'tab-dragready';
export const kNOTIFY_TAB_DRAGCANCEL = 'tab-dragcancel';
export const kNOTIFY_TAB_DRAGSTART  = 'tab-dragstart';
export const kNOTIFY_TAB_DRAGENTER  = 'tab-dragenter';
export const kNOTIFY_TAB_DRAGEXIT   = 'tab-dragexit';
export const kNOTIFY_TAB_DRAGEND    = 'tab-dragend';
export const kNOTIFY_TRY_MOVE_FOCUS_FROM_CLOSING_CURRENT_TAB = 'try-move-focus-from-closing-current-tab';
export const kGET_TREE              = 'get-tree';
export const kATTACH                = 'attach';
export const kDETACH                = 'detach';
export const kINDENT                = 'indent';
export const kDEMOTE                = 'demote';
export const kOUTDENT               = 'outdent';
export const kPROMOTE               = 'promote';
export const kMOVE_UP               = 'move-up';
export const kMOVE_DOWN             = 'move-down';
export const kFOCUS                 = 'focus';
export const kDUPLICATE             = 'duplicate';
export const kGROUP_TABS            = 'group-tabs';
export const kGET_TREE_STRUCTURE    = 'get-tree-structure';
export const kSET_TREE_STRUCTURE    = 'set-tree-structure';
export const kCOLLAPSE_TREE         = 'collapse-tree';
export const kEXPAND_TREE           = 'expand-tree';
export const kADD_TAB_STATE         = 'add-tab-state';
export const kREMOVE_TAB_STATE      = 'remove-tab-state';
export const kSCROLL                = 'scroll';
export const kSCROLL_LOCK           = 'scroll-lock';
export const kSCROLL_UNLOCK         = 'scroll-unlock';
export const kNOTIFY_SCROLLED       = 'scrolled';
export const kBLOCK_GROUPING        = 'block-grouping';
export const kUNBLOCK_GROUPING      = 'unblock-grouping';

export const kCONTEXT_MENU_UPDATED    = 'fake-contextMenu-updated';
export const kCONTEXT_MENU_GET_ITEMS  = 'fake-contextMenu-get-items';
export const kCONTEXT_MENU_OPEN       = 'fake-contextMenu-open';
export const kCONTEXT_MENU_CREATE     = 'fake-contextMenu-create';
export const kCONTEXT_MENU_UPDATE     = 'fake-contextMenu-update';
export const kCONTEXT_MENU_REMOVE     = 'fake-contextMenu-remove';
export const kCONTEXT_MENU_REMOVE_ALL = 'fake-contextMenu-remove-all';
export const kCONTEXT_MENU_CLICK      = 'fake-contextMenu-click';

export const addons = {};

let initialized = false;

export function isInitialized() {
  return initialized;
}

export async function init() {
  const manifest = browser.runtime.getManifest();
  addons[manifest.applications.gecko.id] = {
    id:         manifest.applications.gecko.id,
    internalId: browser.runtime.getURL('').replace(/^moz-extension:\/\/([^\/]+)\/.*$/, '$1'),
    icons:      manifest.icons,
    listeningTypes: []
  };
  initialized = true;
  const respondedAddons = [];
  const notifiedAddons = {};
  const notifyAddons = configs.knownExternalAddons.concat(configs.cachedExternalAddons);
  await Promise.all(notifyAddons.map(async aId => {
    if (aId in notifiedAddons)
      return;
    notifiedAddons[aId] = true;
    try {
      let success = await browser.runtime.sendMessage(aId, {
        type: kNOTIFY_READY
      });
      if (success)
        respondedAddons.push(aId);
    }
    catch(_e) {
    }
  }));
  configs.cachedExternalAddons = respondedAddons;
}

export function setAddons(aAddons) {
  for (let id of Object.keys(addons)) {
    delete addons[id];
  }
  for (let id of Object.keys(aAddons)) {
    addons[id] = aAddons[id];
  }
  return addons;
}

export function serializeTab(aTab) {
  const effectiveFavIcon = TabFavIconHelper.effectiveFavIcons.get(aTab.apiTab.id);
  const children         = Tabs.getChildTabs(aTab).map(serializeTab);
  const ancestorTabIds   = Tabs.getAncestorTabs(aTab).map(aTab => aTab.apiTab.id);
  return Object.assign({}, aTab.apiTab, {
    states:   Array.slice(aTab.classList).filter(aState => Constants.kTAB_INTERNAL_STATES.indexOf(aState) < 0),
    indent:   parseInt(aTab.getAttribute(Constants.kLEVEL) || 0),
    effectiveFavIconUrl: effectiveFavIcon && effectiveFavIcon.favIconUrl,
    children, ancestorTabIds
  });
}

export function getListenersForMessageType(aType) {
  const uniqueTargets = {};
  for (let id of Object.keys(addons)) {
    const addon = addons[id];
    if (addon.listeningTypes.indexOf(aType) > -1)
      uniqueTargets[id] = true;
  }
  return Object.keys(uniqueTargets).map(aId => addons[aId]);
}

export async function sendMessage(aMessage, aOptions = {}) {
  const uniqueTargets = {};
  for (let addon of getListenersForMessageType(aMessage.type)) {
    uniqueTargets[addon.id] = true;
  }
  if (aOptions.targets) {
    if (!Array.isArray(aOptions.targets))
      aOptions.targets = [aOptions.targets];
    for (let id of aOptions.targets) {
      uniqueTargets[id] = true;
    }
  }
  return Promise.all(Object.keys(uniqueTargets).map(async (aId) => {
    try {
      let result = await browser.runtime.sendMessage(aId, aMessage);
      return {
        id:     aId,
        result: result
      };
    }
    catch(e) {
      return {
        id:    aId,
        error: e
      };
    }
  }));
}