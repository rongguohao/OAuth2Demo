// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using IdentityServer4.Models;
using System.Collections.Generic;
using IdentityServer4;

namespace Idp
{
    public static class Config
    {
        public static IEnumerable<IdentityResource> Ids =>
            new IdentityResource[]
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResources.Address(),
                new IdentityResources.Phone(),
                new IdentityResources.Email(),
            };


        public static IEnumerable<ApiResource> Apis =>
            new ApiResource[]
            {
                new ApiResource("api1", "My API #1")
                {
                    ApiSecrets  = { new Secret("api1 secret".Sha256()) }
                }
            };


        public static IEnumerable<Client> Clients =>
            new Client[]
            {
                new Client
                {
                    ClientId = "1",
                    ClientName = "haohaoplay",
                    ClientUri = "http://localhost:4200",
                    ClientSecrets = {new Secret("haohaoplay secret".Sha256())},

                    AllowedGrantTypes = GrantTypes.Code, //授权码模式
                    // AllowAccessTokensViaBrowser = true,
                    RequireConsent = false, // 勾选授权内容页面 默认为true 
                    // AccessTokenLifetime = 60,
                    // AuthorizationCodeLifetime = 60,

                    RedirectUris = {"http://localhost:4200/#/signin-oidc"},

                    // RedirectUris =
                    // {
                    //     "http://localhost:4200/user/signin-oidc",
                    //     "http://localhost:4200/redirect-silentrenew"
                    // },

                    // PostLogoutRedirectUris =
                    // {
                    //     "http://localhost:4200"
                    // },
                    // 

                    //浏览器端跨域设置
                    AllowedCorsOrigins =
                    {
                        "http://localhost:4200"
                    },

                    AlwaysIncludeUserClaimsInIdToken = true,
                    
                    AllowOfflineAccess = true, // offline_access

                    AllowedScopes =
                    {
                        "api1",
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Email,
                        IdentityServerConstants.StandardScopes.Address,
                        IdentityServerConstants.StandardScopes.Phone,
                        IdentityServerConstants.StandardScopes.Profile
                    }
                }
            };
    }
}