import React from "react";
import { Box, VStack, Text, IconButton, useColorMode } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";

const Sidebar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      h="100vh"
      w="250px"
      bg={colorMode === "light" ? "gray.100" : "gray.800"}
      boxShadow="lg"
      zIndex="999"
      overflowY="auto"
      py="4"
    >
      <IconButton
        icon={<FiMenu />}
        aria-label="Toggle sidebar"
        onClick={toggleColorMode}
        position="absolute"
        top="2"
        right="2"
      />
      <VStack spacing="4" align="stretch" mt="8" px="4">
        <Text fontSize="xl" fontWeight="bold">Sidebar Content</Text>
        {/* Add your sidebar items here */}
        <Text>Item 1</Text>
        <Text>Item 2</Text>
        <Text>Item 3</Text>
        <Text>Item 4</Text>
      </VStack>
    </Box>
  );
};

export default Sidebar;
