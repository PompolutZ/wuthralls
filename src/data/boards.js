export default {
    1: {
        name: 'Mirror Well',
		horizontal: {
			startingHexes: {
				0: [[1,1],[3,1],[5,1],[0,3],[1,3],[4,3],[5,4]],
				180: [[2,0],[2,1],[5,1],[6,1],[1,3],[3,3],[5,3]],
			},
			lethalHexes: {
				0: [],
				180: []
			},
			blockedHexes: {
				0: [],
				180: []
			}
		},
		vertical: {
			startingHexes: {
				0: [[1,0],[1,1],[1,4],[0,5],[3,1],[3,3],[3,5]],
				180: [[1,1],[1,3],[1,5],[3,2],[3,5],[3,6],[4,2]],
			},
			lethalHexes: {
				0: [],
				180: []
			},
			blockedHexes: {
				0: [],
				180: []
			}
		}
    },
    2: {
        name: `Katophrane's Reliquary`,
		horizontal: {
			startingHexes: {
				0: [[4,0],[2,1],[4,1],[6,1],[0,3],[6,3],[3,4]],
				180: [[4,0],[0,1],[6,1],[0,3],[2,3],[4,3],[3,4]],
			},
			lethalHexes: {
				0: [],
				180: []
			},
			blockedHexes: {
				0: [],
				180: []
			}
		},
		vertical: {
			startingHexes: {
				0: [[0,3],[1,0],[1,6],[3,2],[3,4],[3,6],[4,4]],
				180: [[0,3],[1,0],[1,2],[1,4],[3,0],[3,6],[4,4]],
			},
			lethalHexes: {
				0: [],
				180: []
			},
			blockedHexes: {
				0: [],
				180: []
			}
		}
    },
    3: {
        name: 'Shyishian Stardial',
		horizontal: {
			startingHexes: {
				0: [[2,0],[5,0],[5,1],[2,2],[4,3],[1,4],[2,4]],
				180: [[5,0],[6,0],[2,1],[5,2],[1,3],[2,4],[5,4]],
			},
			lethalHexes: {
				0: [],
				180: []
			},
			blockedHexes: {
				0: [[3,2],[1,3],[2,3]],
				180: [[4,1],[5,1],[4,2]]
			}
		},
		vertical: {
			startingHexes: {
				0: [[0,1],[0,2],[1,5],[2,2],[3,5],[4,2],[4,5]],
				180: [[0,2],[0,5],[1,1],[2,5],[3,2],[4,5],[4,6]],
			},
			lethalHexes: {
				0: [],
				180: []
			},
			blockedHexes: {
				0: [[1,1],[1,2],[2,3]],
				180: [[2,4],[3,4],[3,5]]
			}
		}
    },
    4: {
        name: 'Shattered Tower',
		horizontal: {
			startingHexes: {
				0: [[1,1],[3,1],[5,2],[0,3],[1,3],[4,4],[6,4]],
				180: [[1,0],[3,0],[5,1],[6,1],[2,2],[3,3],[5,3]],
			},
			lethalHexes: {
				0: [],
				180: []
			},
			blockedHexes: {
				0: [[6,2],[3,3],[5,3]],
				180: [[1,1],[3,1],[1,2]]
			}
		},
		vertical: {
			startingHexes: {
				0: [[0,4],[0,6],[1,0],[1,1],[2,5],[3,1],[3,3]],
				180: [[1,3],[1,5],[2,2],[3,5],[3,6],[4,1],[4,3]],
			},
			lethalHexes: {
				0: [],
				180: []
			},
			blockedHexes: {
				0: [[1,3],[1,5],[2,6]],
				180: [[2,1],[3,1],[3,3]]
			}
		}
    },
    5: {
        name: 'Soul Refractor',
		horizontal: {
			startingHexes: {
				0: [[0,0],[6,0],[2,1],[2,2],[5,2],[6,3],[3,4]],
				180: [[4,0],[0,1],[2,2],[5,2],[4,3],[1,4],[7,4]],
			},
			lethalHexes: {
				0: [],
				180: []
			},
			blockedHexes: {
				0: [[3,1],[2,3],[4,3]],
				180: [[2,1],[4,1],[3,3]]
			}
		},
		vertical: {
			startingHexes: {
				0: [[0,3],[1,6],[2,2],[2,5],[3,2],[4,0],[4,6]],
				180: [[0,1],[0,7],[1,4],[2,2],[2,5],[3,0],[4,4]],
			},
			lethalHexes: {
				0: [],
				180: []
			},
			blockedHexes: {
				0: [[1,2],[1,4],[3,3]],
				180: [[1,3],[3,2],[3,4]]
			}
		}
    },
    6: {
        name: 'Ruptured Seal',
		horizontal: {
			startingHexes: {
				0: [[3,0],[6,0],[1,1],[2,2],[4,2],[5,4],[7,4]],
				180: [[0,0],[2,0],[3,2],[5,2],[5,3],[1,4],[4,4]],
			},
			lethalHexes: {
				0: [[6,2],[5,3],[1,4]],
				180: [[6,0], [1,1],[1,2]]
			},
			blockedHexes: {
				0: [],
				180: []
			}
		},
		vertical: {
			startingHexes: {
				0: [[0,5],[0,7],[2,2],[2,4],[3,1],[4,3],[4,6]],
				180: [[0,1],[0,4],[1,5],[2,3],[2,5],[4,0],[4,2]],
			},
			lethalHexes: {
				0: [[0,1],[1,5],[2,6]],
				180: [[2,1], [3,1],[4,6]]
			},
			blockedHexes: {
				0: [],
				180: []
			}
		}	
    },
    7: {
        name: 'Abandoned Lair',
		horizontal: {
			startingHexes: {
				0: [[1,1],[3,1],[5,2],[0,3],[2,3],[5,3],[4,4]],
				180: [[3,0],[1,1],[4,1],[6,1],[2,2],[3,3],[5,3]],
			},
			lethalHexes: {
				0: [],
				180: []
			},
			blockedHexes: {
				0: [],
				180: []
			}
		},
		vertical: {
			startingHexes: {
				0: [[0,4],[1,0],[1,2],[1,5],[2,5],[3,1],[3,3]],
				180: [[1,3],[1,5],[2,2],[3,1],[3,4],[3,6],[4,3]],
			},
			lethalHexes: {
				0: [],
				180: []
			},
			blockedHexes: {
				0: [],
				180: []
			}
		}
    },
    8: {
        name: 'Living Rock',
        horizontal: {
            startingHexes: {
                0: [[1,0],[4,1],[2,2],[4,3],[6,3],[2,4],[3,4]],
                180: [[4,0],[5,0],[0,1],[2,1],[5,2],[2,3],[6,4]],
            },
            lethalHexes: {
                0: [[6,2]],
                180: [[1,2]]
            },
            blockedHexes: {
                0: [[1,2],[3,2]],
                180: [[4,2],[6,2]]
            }            
        },
        vertical: {
            startingHexes: {
                0: [[4,1],[0,2],[2,2],[0,3],[1,4],[3,4],[1,6]],
                180: [[0,3],[1,2],[3,2],[4,4],[2,5],[4,5],[0,6]],
            },
            lethalHexes: {
                0: [[2,6]],
                180: [[2,1]]
            },
            blockedHexes: {
                0: [[2,1],[2,3]],
                180: [[2,4],[2,6]]
            }            
        },
    },
    9: {
        name: 'Shrine of the Silent People',
		horizontal: {
			startingHexes: {
				0: [[3,0],[4,0],[0,1],[1,2],[2,3],[4,3],[6,3]],
				180: [[0,1],[2,1],[4,1],[6,2],[6,3],[3,4],[4,4]],
			},
			lethalHexes: {
				0: [],
				180: []
			},
			blockedHexes: {
				0: [[6,2], [3,3], [1,4]],
				180: [[6,0], [3,1], [1,2]]
			}
		},
		vertical: {
			startingHexes: {
				0: [[1,2],[1,4],[1,6],[2,1],[3,0],[4,3],[4,4]],
				180: [[0,3],[0,4],[1,6],[2,6],[3,0],[3,2],[3,4]],
			},
			lethalHexes: {
				0: [],
				180: []
			},
			blockedHexes: {
				0: [[0,1], [1,3], [2,6]],
				180: [[2,1], [3,3], [4,6]]
			}
		}
    },
    10: {
        name: 'Wyrmgrave',
		horizontal: {
			startingHexes: {
				0: [[4,0],[0,2],[3,2],[5,2],[1,3],[3,3],[6,4]],
				180: [[1,0],[3,1],[5,1],[2,2],[4,2],[7,2],[3,4]],
			},
			lethalHexes: {
				0: [[2,1]],
				180: [[4,3]]
			},
			blockedHexes: {
				0: [],
				180: []
			}
		},
		vertical: {
			startingHexes: {
				0: [[0,6],[1,1],[1,3],[2,0],[2,3],[2,5],[4,4]],
				180: [[0,3],[2,2],[2,4],[2,7],[3,3],[3,5],[4,1]],
			},
			lethalHexes: {
				0: [[3,2]],
				180: [[1,4]]
			},
			blockedHexes: {
				0: [],
				180: []
			}
		}
    },
    11: {
        name: 'Molten Shardpit',
		horizontal: {
			startingHexes: {
				0: [[0,0],[3,0],[6,0],[2,1],[5,2],[3,3],[7,4]],
				180: [[0,0],[3,1],[2,2],[4,3],[1,4],[4,4],[7,4]],
			},
			lethalHexes: {
				0: [[1,2],[0,3],[1,3]],
				180: [[5,1],[6,1],[6,2]],
			},
			blockedHexes: {
				0: [[4,3]],
				180: [[2,1]]
			}
		},
		vertical: {
			startingHexes: {
				0: [[0,7],[1,3],[2,5],[3,2],[4,0],[4,3],[4,6]],
				180: [[0,1],[0,4],[0,7],[1,4],[2,2],[3,3],[4,0]],
			},
			lethalHexes: {
				0: [[1,0],[1,1],[2,1]],
				180: [[2,6],[3,5],[3,6]],
			},
			blockedHexes: {
				0: [[1,4]],
				180: [[3,2]]
			}
		}
    },
    12: {
        name: 'Shattered Refractor',
		horizontal: {
			startingHexes: {
				0: [[5,0],[1,1],[3,2],[4,2],[5,2],[1,4],[6,4]],
				180: [[1,0],[6,0],[2,2],[3,2],[4,2],[5,3],[2,4]],
			},
			lethalHexes: {
				0: [[4,1]],
				180: [[2,3]]
			},
			blockedHexes: {
				0: [[1,3],[3,3]],
				180: [[3,1],[5,1]]
			}
		},
		vertical: {
			startingHexes: {
				0: [[0,1],[0,6],[2,3],[2,4],[2,5],[3,1],[4,5]],
				180: [[0,2],[1,5],[2,2],[2,3],[2,4],[4,1],[4,6]],
			},
			lethalHexes: {
				0: [[3,4]],
				180: [[1,2]]
			},
			blockedHexes: {
				0: [[1,1],[1,3]],
				180: [[3,3],[3,5]]
			}
		}
    },
    13: {
        name: 'Cursed Oubliette',
		horizontal: {
			startingHexes: {
				0: [[0,0],[4,1],[2,2],[3,2],[6,2],[4,4],[7,4]],
				180: [[0,0],[3,0],[1,2],[4,2],[5,2],[2,3],[7,4]],
			},
			lethalHexes: {
				0: [],
				180: []
			},
			blockedHexes: {
				0: [],
				180: []
			}
		},
		vertical: {
			startingHexes: {
				0: [[0,4],[0,7],[2,2],[2,3],[2,6],[3,4],[4,0]],
				180: [[0,7],[1,2],[2,1],[2,4],[2,5],[4,0],[4,3]],
			},
			lethalHexes: {
				0: [],
				180: []
			},
			blockedHexes: {
				0: [],
				180: []
			}
		}
    },
    14: {
        name: "Penitent's Throne",
		horizontal: {
			startingHexes: {
				0: [[1,0],[4,0],[3,1],[2,3],[3,3],[6,3],[1,4]],
				180: [[6,0],[0,1],[3,1],[4,1],[3,3],[3,4],[6,4]],
			},
			lethalHexes: {
				0: [[6,0],[5,2]],
				180: [[2,2],[1,4]]
			},
			blockedHexes: {
				0: [[1,1],[2,1]],
				180: [[4,3],[5,3]]
			}
		},
		vertical: {
			startingHexes: {
				0: [[0,1],[1,2],[1,3],[1,6],[3,3],[4,1],[4,4]],
				180: [[0,3],[0,6],[1,3],[3,0],[3,3],[3,4],[4,6]],
			},
			lethalHexes: {
				0: [[2,5],[4,6]],
				180: [[0,1],[3,2]]
			},
			blockedHexes: {
				0: [[3,1],[3,2]],
				180: [[1,4],[1,5]]
			}
		}
    }
}

// export default {
//     1: {
//         name: 'Mirror Well',
//         startingHexes: {
//             0: [[1,1],[3,1],[5,1],[0,3],[1,3],[4,3],[5,4]],
//             180: [[2,0],[2,1],[5,1],[6,1],[1,3],[3,3],[5,3]],
//         },
//         lethalHexes: {
//             0: [],
//             180: []
//         },
//         blockedHexes: {
//             0: [],
//             180: []
//         }
//     },
//     2: {
//         name: `Katophrane's Reliquary`,
//         startingHexes: {
//             0: [[4,0],[2,1],[4,1],[6,1],[0,3],[6,3],[3,4]],
//             180: [[4,0],[0,1],[6,1],[0,3],[2,3],[4,3],[3,4]],
//         },
//         lethalHexes: {
//             0: [],
//             180: []
//         },
//         blockedHexes: {
//             0: [],
//             180: []
//         }
//     },
//     3: {
//         name: 'Shyishian Stardial',
//         startingHexes: {
//             0: [[2,0],[5,0],[5,1],[2,2],[4,3],[1,4],[2,4]],
//             180: [[5,0],[6,0],[2,1],[5,2],[1,3],[2,4],[5,4]],
//         },
//         lethalHexes: {
//             0: [],
//             180: []
//         },
//         blockedHexes: {
//             0: [[3,2],[1,3],[2,3]],
//             180: [[4,1],[5,1],[4,2]]
//         }
//     },
//     4: {
//         name: 'Shattered Tower',
//         startingHexes: {
//             0: [[1,1],[3,1],[5,2],[0,3],[1,3],[4,4],[6,4]],
//             180: [[1,0],[3,0],[5,1],[6,1],[2,2],[3,3],[5,3]],
//         },
//         lethalHexes: {
//             0: [],
//             180: []
//         },
//         blockedHexes: {
//             0: [[6,2],[3,3],[5,3]],
//             180: [[1,1],[3,1],[1,2]]
//         }
//     },
//     5: {
//         name: 'Soul Refractor',
//         startingHexes: {
//             0: [[0,0],[6,0],[2,1],[2,2],[5,2],[6,3],[3,4]],
//             180: [[4,0],[0,1],[2,2],[5,2],[4,3],[1,4],[7,4]],
//         },
//         lethalHexes: {
//             0: [],
//             180: []
//         },
//         blockedHexes: {
//             0: [[3,1],[2,3],[4,3]],
//             180: [[2,1],[4,1],[3,3]]
//         }
//     },
//     6: {
//         name: 'Ruptured Seal',
//         startingHexes: {
//             0: [[3,0],[6,0],[1,1],[2,2],[4,2],[5,4],[7,4]],
//             180: [[0,0],[2,0],[3,2],[5,2],[5,3],[1,4],[4,4]],
//         },
//         lethalHexes: {
//             0: [[6,2],[5,3],[1,4]],
//             180: [[6,0], [1,1],[1,2]]
//         },
//         blockedHexes: {
//             0: [],
//             180: []
//         }
//     },
//     7: {
//         name: 'Abandoned Lair',
//         startingHexes: {
//             0: [[1,1],[3,1],[5,2],[0,3],[2,3],[5,3],[4,4]],
//             180: [[3,0],[1,1],[4,1],[6,1],[2,2],[3,3],[5,3]],
//         },
//         lethalHexes: {
//             0: [],
//             180: []
//         },
//         blockedHexes: {
//             0: [],
//             180: []
//         }
//     },
//     8: {
//         name: 'Living Rock',
//         horizontal: {
//             startingHexes: {
//                 0: [[1,0],[4,1],[2,2],[4,3],[6,3],[2,4],[3,4]],
//                 180: [[4,0],[5,0],[0,1],[2,1],[5,2],[2,3],[6,4]],
//             },
//             lethalHexes: {
//                 0: [[6,2]],
//                 180: [[1,2]]
//             },
//             blockedHexes: {
//                 0: [[1,2],[3,2]],
//                 180: [[4,2],[6,2]]
//             }            
//         },
//         vertical: {
//             startingHexes: {
//                 0: [[4,1],[0,2],[2,2],[0,3],[1,4],[3,4],[1,6]],
//                 180: [[0,3],[1,2],[3,2],[4,4],[2,5],[4,5],[0,6]],
//             },
//             lethalHexes: {
//                 0: [[2,6]],
//                 180: [[2,1]]
//             },
//             blockedHexes: {
//                 0: [[2,1],[2,3]],
//                 180: [[2,4],[2,6]]
//             }            
//         },
//     },
//     9: {
//         name: 'Shrine of the Silent People',
//         startingHexes: {
//             0: [[3,0],[4,0],[0,1],[1,2],[2,3],[4,3],[6,3]],
//             180: [[0,1],[2,1],[4,1],[6,2],[6,3],[3,4],[4,4]],
//         },
//         lethalHexes: {
//             0: [],
//             180: []
//         },
//         blockedHexes: {
//             0: [[6,2], [3,3], [1,4]],
//             180: [[6,0], [3,1], [1,2]]
//         }
//     },
//     10: {
//         name: 'Wyrmgrave',
//         startingHexes: {
//             0: [[4,0],[0,2],[3,2],[5,2],[1,3],[3,3],[6,4]],
//             180: [[1,0],[3,1],[5,1],[2,2],[4,2],[7,2],[3,4]],
//         },
//         lethalHexes: {
//             0: [[2,1]],
//             180: [[4,3]]
//         },
//         blockedHexes: {
//             0: [],
//             180: []
//         }
//     },
//     11: {
//         name: 'Molten Shardpit',
//         startingHexes: {
//             0: [[0,0],[3,0],[6,0],[2,1],[5,2],[3,3],[7,4]],
//             180: [[0,0],[3,1],[2,2],[4,3],[1,4],[4,4],[7,4]],
//         },
//         lethalHexes: {
//             0: [[1,2],[0,3],[1,3]],
//             180: [[5,1],[6,1],[6,2]],
//         },
//         blockedHexes: {
//             0: [[4,3]],
//             180: [[2,1]]
//         }
//     },
//     12: {
//         name: 'Shattered Refractor',
//         startingHexes: {
//             0: [[5,0],[1,1],[3,2],[4,2],[5,2],[1,4],[6,4]],
//             180: [[1,0],[6,0],[2,2],[3,2],[4,2],[5,3],[2,4]],
//         },
//         lethalHexes: {
//             0: [[4,1]],
//             180: [[2,3]]
//         },
//         blockedHexes: {
//             0: [[1,3],[3,3]],
//             180: [[3,1],[5,1]]
//         }
//     },
//     13: {
//         name: 'Cursed Oubliette',
//         startingHexes: {
//             0: [[0,0],[4,1],[2,2],[3,2],[6,2],[4,4],[7,4]],
//             180: [[0,0],[3,0],[1,2],[4,2],[5,2],[2,3],[7,4]],
//         },
//         lethalHexes: {
//             0: [],
//             180: []
//         },
//         blockedHexes: {
//             0: [],
//             180: []
//         }
//     },
//     14: {
//         name: "Penitent's Throne",
//         startingHexes: {
//             0: [[1,0],[4,0],[3,1],[2,3],[3,3],[6,3],[1,4]],
//             180: [[6,0],[0,1],[3,1],[4,1],[3,3],[3,4],[6,4]],
//         },
//         lethalHexes: {
//             0: [[6,0],[5,2]],
//             180: [[2,2],[1,4]]
//         },
//         blockedHexes: {
//             0: [[1,1],[2,1]],
//             180: [[4,3],[5,3]]
//         }
//     },
// }