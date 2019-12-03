/*
 * Tencent is pleased to support the open source community by making TKEStack
 * available.
 *
 * Copyright (C) 2012-2019 Tencent. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at
 *
 * https://opensource.org/licenses/Apache-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OF ANY KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations under the License.
 */

// Code generated by lister-gen. DO NOT EDIT.

package internalversion

import (
	"k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/client-go/tools/cache"
	platform "tkestack.io/tke/api/platform"
)

// ClusterAddonLister helps list ClusterAddons.
type ClusterAddonLister interface {
	// List lists all ClusterAddons in the indexer.
	List(selector labels.Selector) (ret []*platform.ClusterAddon, err error)
	// Get retrieves the ClusterAddon from the index for a given name.
	Get(name string) (*platform.ClusterAddon, error)
	ClusterAddonListerExpansion
}

// clusterAddonLister implements the ClusterAddonLister interface.
type clusterAddonLister struct {
	indexer cache.Indexer
}

// NewClusterAddonLister returns a new ClusterAddonLister.
func NewClusterAddonLister(indexer cache.Indexer) ClusterAddonLister {
	return &clusterAddonLister{indexer: indexer}
}

// List lists all ClusterAddons in the indexer.
func (s *clusterAddonLister) List(selector labels.Selector) (ret []*platform.ClusterAddon, err error) {
	err = cache.ListAll(s.indexer, selector, func(m interface{}) {
		ret = append(ret, m.(*platform.ClusterAddon))
	})
	return ret, err
}

// Get retrieves the ClusterAddon from the index for a given name.
func (s *clusterAddonLister) Get(name string) (*platform.ClusterAddon, error) {
	obj, exists, err := s.indexer.GetByKey(name)
	if err != nil {
		return nil, err
	}
	if !exists {
		return nil, errors.NewNotFound(platform.Resource("clusteraddon"), name)
	}
	return obj.(*platform.ClusterAddon), nil
}
